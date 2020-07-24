package com.payten.instapay.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="ROLES")
public class Role {

    @Id
    @Column(name="ROLE_ID")
    private Integer roleId;

    @Column(name="ROLENAME")
    private String roleName;

    @Column(name="DESCRIPTION")
    private String description;

    @ManyToMany(mappedBy = "roles")
    @JsonBackReference
    private Set<Group> groups = new HashSet<>();

    public Role() {
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Group> getGroups() {
        return groups;
    }

    public void setGroups(Set<Group> groups) {
        this.groups = groups;
    }
}
