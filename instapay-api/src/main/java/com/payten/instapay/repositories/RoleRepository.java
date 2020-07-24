package com.payten.instapay.repositories;

import com.payten.instapay.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    List<Role> findAll();
    Role getByRoleId(Integer roleId);
}
