package com.payten.instapay.dto.Group;

import javax.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

public class GroupDto {

    @NotEmpty(message = "Morate uneti ime grupe uloga")
    private String groupName;

    private String description;

    private List<Integer> roleIds = new ArrayList<>();

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Integer> getRoleIds() {
        return roleIds;
    }

    public void setRoleIds(List<Integer> roleIds) {
        this.roleIds = roleIds;
    }
}
