package com.payten.instapay.repositories;

import com.payten.instapay.model.Group;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Integer>, PagingAndSortingRepository<Group, Integer>{

    List<Group> findAll();
    Page<Group> findAll(Pageable page);

    Page<Group> findByGroupNameContaining(String groupName, Pageable page);
    Page<Group> findByDescriptionContaining(String description, Pageable page);

    Group getByGroupId(Integer groupId);

    boolean existsByGroupName(String groupName);
}
