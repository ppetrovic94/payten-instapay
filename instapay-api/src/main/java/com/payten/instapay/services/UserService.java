package com.payten.instapay.services;

import com.payten.instapay.dto.Group.GroupDto;
import com.payten.instapay.dto.User.UserDto;
import com.payten.instapay.model.Group;
import com.payten.instapay.model.Role;
import com.payten.instapay.model.User;
import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.validation.BindingResult;

import java.util.List;

public interface UserService extends UserDetailsService {
    User addUser(UserDto user, BindingResult result);
    UserDto getUserById(Integer userId);
    User findByUsernameAndPassword(String username, String password);
    Page<User> getUsers(int pageNumber, String searchTerm);
    User updateUser(Integer userId, UserDto user, BindingResult result);
    void deleteUser(Integer userId);
    List<Group> getGroups();
}
