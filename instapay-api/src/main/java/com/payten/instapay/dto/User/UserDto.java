package com.payten.instapay.dto.User;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class UserDto {

    @NotEmpty(message = "Morate uneti korisničko ime korisnika")
    private String username;

    @Email(message = "Uneti email nije u dobrom formatu")
    private String email;

    @NotEmpty(message = "Morate uneti lozinku korisnika")
    private String password;

    @NotNull(message = "Morate uneti status korisnika")
    private Integer isApproved;

    @NotEmpty(message = "Morate uneti ime korisnika")
    private String fullName;

    private List<Integer> groupIds = new ArrayList<>();

    public UserDto(){}

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getIsApproved() {
        return isApproved;
    }

    public void setIsApproved(Integer isApproved) {
        this.isApproved = isApproved;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public List<Integer> getGroupIds() {
        return groupIds;
    }

    public void setGroupIds(List<Integer> groupIds) {
        this.groupIds = groupIds;
    }
}
