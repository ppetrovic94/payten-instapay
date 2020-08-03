package com.payten.instapay.controllers;

import com.payten.instapay.dto.User.UserDto;
import com.payten.instapay.model.Group;
import com.payten.instapay.model.User;
import com.payten.instapay.services.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path="/api/admin",produces = "application/json")
@CrossOrigin(origins="*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    @ResponseStatus(HttpStatus.OK)
    public Page<User> getUsers(@RequestParam(name="pagenum",required = false, defaultValue = "0") int pageNumber,
                               @RequestParam(name="searchTerm", required = false, defaultValue="") String searchTerm){
        return userService.getUsers(pageNumber,searchTerm);
    }

    @GetMapping("/users/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public UserDto getUserById(@PathVariable Integer userId){
        return userService.getUserById(userId);
    }

    @PostMapping("/users/add")
    @ResponseStatus(value = HttpStatus.CREATED)
    public User addUser(@Valid @RequestBody UserDto userDto, BindingResult result){
        return userService.addUser(userDto, result);
    }

    @PutMapping("/users/{userId}/edit")
    @ResponseStatus(value = HttpStatus.OK)
    public User updateUser(@PathVariable Integer userId, @Valid @RequestBody UserDto userDto, BindingResult result){
        return userService.updateUser(userId, userDto, result);
    }

    @DeleteMapping("/users/{userId}/delete")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Integer userId){
        userService.deleteUser(userId);
    }

    @GetMapping("/users/groups")
    @ResponseStatus(value = HttpStatus.OK)
    public List<Group> getGroupRoles(){
        return userService.getGroups();
    }

}
