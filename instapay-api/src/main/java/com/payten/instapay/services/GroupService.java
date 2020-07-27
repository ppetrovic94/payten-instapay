package com.payten.instapay.services;

import com.payten.instapay.dto.Group.GroupDto;
import com.payten.instapay.model.Group;
import com.payten.instapay.model.Role;
import org.springframework.data.domain.Page;
import org.springframework.validation.BindingResult;

import java.util.List;

public interface GroupService {
    Page<Group> getGroups(int pageNumber, String searchTerm);

    GroupDto getGroupById(Integer groupId);

    Group addGroup(GroupDto groupDto, BindingResult result);

    GroupDto updateGroup(GroupDto groupDto, Integer groupId, BindingResult result);

    void deleteGroup(Integer groupId);

    List<Role> getRoles();
}
