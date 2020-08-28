package com.payten.instapay.services.impl;

import com.payten.instapay.dto.Group.GroupDto;
import com.payten.instapay.exceptions.handlers.RequestedResourceNotFoundException;
import com.payten.instapay.exceptions.handlers.ValidationException;
import com.payten.instapay.model.Group;
import com.payten.instapay.model.Role;
import com.payten.instapay.repositories.GroupRepository;
import com.payten.instapay.repositories.RoleRepository;
import com.payten.instapay.services.GroupService;
import com.payten.instapay.services.validation.MapValidationErrorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.util.*;

@Service
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final RoleRepository roleRepository;
    private final MapValidationErrorService mapValidationErrorService;

    public GroupServiceImpl(GroupRepository groupRepository, RoleRepository roleRepository, MapValidationErrorService mapValidationErrorService) {
        this.groupRepository = groupRepository;
        this.roleRepository = roleRepository;
        this.mapValidationErrorService = mapValidationErrorService;
    }

    @Override
    public Page<Group> getGroups(int pageNumber, String searchTerm, String sortBy, String direction) {
        Pageable page;
        Page<Group> groups;

        if (sortBy.isEmpty()){
            page = PageRequest.of(pageNumber, 10,Sort.Direction.ASC, "groupName");
        } else {
            page = PageRequest.of(pageNumber, 10, direction.equals("ascending") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        }

        if (searchTerm.isEmpty()) {
            groups = groupRepository.findAll(page);
            return groups;
        }

        groups = searchByTerm(searchTerm, page);
        return groups;
    }

    @Override
    public GroupDto getGroupById(Integer groupId) {
        Group found = groupRepository.getByGroupId(groupId);

        if (found == null) throw new RequestedResourceNotFoundException("Grupa sa ID-em: " + groupId + " ne postoji");

        return convertToDto(found);
    }

    @Override
    public Group addGroup(GroupDto groupDto, BindingResult result) {
        Map<String, String> errorMap = mapValidationErrorService.validate(result);

        if(groupDto.getRoleIds().isEmpty())
            errorMap.put("roleIds", "Grupi mora biti dodeljena bar jedna uloga");

        if (errorMap != null) {
            throw new ValidationException(errorMap);
        } else {
            errorMap = checkGroupUniqueConstraints(groupDto.getGroupName(), null);
            if (errorMap != null) {
                throw new ValidationException(errorMap);
            }
        }

        Group group = convertToEntity(groupDto, null);
        return groupRepository.save(group);
    }



    @Override
    public GroupDto updateGroup(GroupDto groupDto, Integer groupId, BindingResult result) {
        Group found = groupRepository.getByGroupId(groupId);

        if (found == null) {
            throw new RequestedResourceNotFoundException("Grupa sa ID-em: " + groupId + " ne postoji");
        }

        Map<String, String> errorMap = mapValidationErrorService.validate(result);

        if(groupDto.getRoleIds().isEmpty())
            errorMap.put("roleIds", "Grupi mora biti dodeljena bar jedna uloga");

        if (errorMap != null) {
            throw new ValidationException(errorMap);
        } else {
            errorMap = checkGroupUniqueConstraints(groupDto.getGroupName(), found);
            if (errorMap != null) {
                throw new ValidationException(errorMap);
            }
        }

        Group group = convertToEntity(groupDto, found);
        groupRepository.save(group);
        return convertToDto(group);
    }

    @Override
    public void deleteGroup(Integer groupId) {
        Group found = groupRepository.getByGroupId(groupId);

        if (found == null) {
            throw new RequestedResourceNotFoundException("Grupa sa ID-em: " + groupId + " ne postoji");
        }

        groupRepository.delete(found);
    }

    @Override
    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    private Group convertToEntity(GroupDto groupDto, Group group){
        if (group == null) {
            Group newGroup = new Group();
            setGroupRoles(groupDto.getRoleIds(), newGroup);
            newGroup.setGroupName(groupDto.getGroupName());
            newGroup.setDescription(groupDto.getDescription());
            return newGroup;
        }
        setGroupRoles(groupDto.getRoleIds(), group);
        group.setGroupName(groupDto.getGroupName());
        group.setDescription(groupDto.getDescription());
        return group;
    }

    private GroupDto convertToDto(Group group) {
        GroupDto groupDto = new GroupDto();
        groupDto.setGroupName(group.getGroupName());
        groupDto.setDescription(group.getDescription());
        if (group.getRoles() != null) {
            for (Role role: group.getRoles()){
                groupDto.getRoleIds().add(role.getRoleId());
            }
        }
        return groupDto;
    }

    private void setGroupRoles(List<Integer> roleIds, Group group) {
        if (roleIds == null) throw new RequestedResourceNotFoundException("Grupi nisu dodeljene uloge");

        Set<Role> roles = new HashSet<>();
        for (Integer roleId: roleIds) {
            Role role = roleRepository.getByRoleId(roleId);
            if (role == null) throw new RequestedResourceNotFoundException("Uloga sa IDem: " + roleId + " ne postoji");
            roles.add(role);
        }
        group.setRoles(roles);
    }


    private Page<Group> searchByTerm(String searchTerm, Pageable page) {
        Page<Group> filtered;

        filtered = groupRepository.findByGroupNameContaining(searchTerm, page);
        if (!filtered.getContent().isEmpty()) return filtered;
        filtered = groupRepository.findByDescriptionContaining(searchTerm, page);
        if (!filtered.getContent().isEmpty()) return filtered;

        return filtered;
    }

    private Map<String, String> checkGroupUniqueConstraints(String groupName, Group group) {
        Map<String, String> errorMap;

        if (group != null && group.getGroupName().equals(groupName)) {
            errorMap = null;
        } else {
            if (groupRepository.existsByGroupName(groupName)) {
                errorMap = new HashMap<>();
                errorMap.put("groupName", "Grupa sa nazivom: " + groupName + " već postoji");
                return errorMap;
            }
        }

        return null;
    }

}
