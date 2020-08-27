package com.payten.instapay.controllers;

import com.payten.instapay.dto.Group.GroupDto;
import com.payten.instapay.model.Group;
import com.payten.instapay.model.Role;
import com.payten.instapay.services.GroupService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path="/api/admin",produces = "application/json")
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping("/groups")
    @ResponseStatus(value = HttpStatus.OK)
    public Page<Group> getGroups(@RequestParam(name="pagenum",required = false, defaultValue = "0") int pageNumber,
                                 @RequestParam(name="searchTerm", required = false, defaultValue="") String searchTerm,
                                 @RequestParam(name ="sortBy", required = false, defaultValue = "") String sortBy,
                                 @RequestParam(name = "direction", required = false, defaultValue = "ASC") String direction) {
        return groupService.getGroups(pageNumber, searchTerm, sortBy, direction);
    }

    @GetMapping("/groups/{groupId}")
    @ResponseStatus(value = HttpStatus.OK)
    public GroupDto getGroupById(@PathVariable Integer groupId) {
        return groupService.getGroupById(groupId);
    }

    @PostMapping("/groups/add")
    @ResponseStatus(value = HttpStatus.OK)
    public Group addGroup(@Valid @RequestBody GroupDto groupDto, BindingResult result){
        return groupService.addGroup(groupDto, result);
    }

    @PutMapping("/groups/{groupId}/update")
    @ResponseStatus(value = HttpStatus.OK)
    public GroupDto updateGroup(@PathVariable Integer groupId, @Valid @RequestBody GroupDto groupDto, BindingResult result){
        return groupService.updateGroup(groupDto, groupId, result);
    }

    @DeleteMapping("/groups/{groupId}/delete")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void deleteGroup(@PathVariable Integer groupId){
        groupService.deleteGroup(groupId);
    }

    @GetMapping("/roles")
    @ResponseStatus(value = HttpStatus.OK)
    public List<Role> getRoles(){
        return groupService.getRoles();
    }

}
