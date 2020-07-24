package com.payten.instapay.services.impl;

import com.payten.instapay.dto.User.UserDto;
import com.payten.instapay.exceptions.handlers.RequestedResourceNotFoundException;
import com.payten.instapay.exceptions.handlers.ValidationException;
import com.payten.instapay.model.Group;
import com.payten.instapay.model.User;
import com.payten.instapay.repositories.GroupRepository;
import com.payten.instapay.repositories.UserRepository;
import com.payten.instapay.services.UserService;
import com.payten.instapay.services.validation.MapValidationErrorService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.util.*;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final MapValidationErrorService mapValidationErrorService;
    private final ModelMapper modelMapper;

    public UserServiceImpl(UserRepository userRepository, GroupRepository groupRepository, MapValidationErrorService mapValidationErrorService, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.mapValidationErrorService = mapValidationErrorService;
        this.modelMapper = modelMapper;
    }

    @Override
    public Page<User> getUsers(int pageNum, String searchTerm) {
        Pageable page = PageRequest.of(pageNum, 25, Sort.by("userId"));
        Page<User> users = null;

        if (searchTerm.isEmpty()) {
            users = userRepository.findAll(page);
            return users;
        }

        users = searchByTerm(searchTerm, page);
        return users;
    }

    @Override
    public UserDto getUserById(Integer userId) {
        User user = userRepository.getByUserId(userId);
        if (user == null) throw new RequestedResourceNotFoundException("Korisnik sa ID-em: " + userId + " ne postoji");
        return convertToDto(user);
    }

    @Override
    public User addUser(UserDto userDto, BindingResult result) {
        Map<String, String> errorMap = mapValidationErrorService.validate(result);

        if (errorMap != null) {
            throw new ValidationException(errorMap);
        } else {
            errorMap = checkUserUniqueConstraints(userDto.getUsername(), userDto.getEmail(), null);
            if (errorMap != null) {
                throw new ValidationException(errorMap);
            }
        }

        User user = convertToEntity(userDto, null);
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Integer userId, UserDto userDto, BindingResult result) {
        User found = userRepository.getByUserId(userId);

        if (found == null) {
            throw new RequestedResourceNotFoundException("Korisnik sa ID-em: " + userId + " ne postoji u bazi ");
        }

        Map<String, String> errorMap = mapValidationErrorService.validate(result);
        if (errorMap != null) {
            throw new ValidationException(errorMap);
        } else {
            errorMap = checkUserUniqueConstraints(userDto.getUsername(), userDto.getEmail(), found);
            if (errorMap != null) {
                throw new ValidationException(errorMap);
            }
        }

        return userRepository.save(convertToEntity(userDto, found));
    }

    @Override
    public void deleteUser(Integer userId) {
        User found = userRepository.getByUserId(userId);

        if (found == null) {
            throw new RequestedResourceNotFoundException("Korisnik sa ID-em: " + userId + " ne postoji u bazi ");
        }

        userRepository.delete(found);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) throw new RequestedResourceNotFoundException("Korisnik sa korisničkim imenom: " + username + " ne postoji");
        return user;
    }

    @Override
    public User findByUsernameAndPassword(String username, String password) {
        return userRepository.findByUsernameAndPassword(username, password);
    }

    @Override
    public List<Group> getGroups() {
        return groupRepository.findAll();
    }


    private User convertToEntity(UserDto userDto, User user) {
        if (user == null) {
            User newUser = new User();
            setUserGroups(userDto.getGroupIds(), newUser);
            newUser.setUsername(userDto.getUsername());
            newUser.setPassword(userDto.getPassword());
            newUser.setEmail(userDto.getEmail());
            newUser.setIsApproved(userDto.getIsApproved());
            newUser.setFullName(userDto.getFullName());
            return newUser;
        }
        setUserGroups(userDto.getGroupIds(), user);
        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());
        user.setEmail(userDto.getEmail());
        user.setIsApproved(userDto.getIsApproved());
        user.setFullName(userDto.getFullName());

        return user;
    }

    private UserDto convertToDto(User user){
        UserDto userDto = new UserDto();
        userDto.setFullName(user.getFullName());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setPassword(user.getPassword());
        userDto.setIsApproved(user.getIsApproved());
        if (user.getGroups() != null) {
            for (Group userGroup: user.getGroups()){
                userDto.getGroupIds().add(userGroup.getGroupId());
            }
        }
        return userDto;
    }

    private void setUserGroups(List<Integer> groupIds, User user) {
        if (groupIds == null) throw new RequestedResourceNotFoundException("Korisniku nije dodeljena nijedna grupa uloga.");

        Set<Group> groups = new HashSet<>();
        for(Integer groupId : groupIds){
            Group group = groupRepository.getByGroupId(groupId);
            if (group == null) throw new RequestedResourceNotFoundException("Grupa sa ID-em: " + groupId + " ne postoji u bazi");
            groups.add(group);
        }
        user.setGroups(groups);
    }

    private Page<User> searchByTerm(String searchTerm, Pageable page) {
        Page<User> filtered;

        filtered = userRepository.findByUsernameContaining(searchTerm, page);
        if (!filtered.getContent().isEmpty()) return filtered;
        filtered = userRepository.findByEmailContaining(searchTerm, page);
        if (!filtered.getContent().isEmpty()) return filtered;

        return filtered;
    }

    private Map<String, String> checkUserUniqueConstraints(String username, String email, User user) {
        Map<String, String> errorMap;

        if (user != null && user.getUsername().equals(username)) {
            errorMap = null;
        } else {
            if (userRepository.existsByUsername(username)) {
                errorMap = new HashMap<>();
                errorMap.put("username", "Korisnik sa unetim korisničkim imenom: " + username + " već postoji u bazi");
                return errorMap;
            }
        }

        if (user != null && user.getEmail().equals(email)) {
            errorMap = null;
        } else {
            if (userRepository.existsByUsername(username)) {
                errorMap = new HashMap<>();
                errorMap.put("email", "Korisnik sa unetim email-om: " + email + " već postoji u bazi");
                return errorMap;
            }
        }

        return null;
    }


}
