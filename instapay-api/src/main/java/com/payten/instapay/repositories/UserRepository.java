package com.payten.instapay.repositories;

import com.payten.instapay.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>, PagingAndSortingRepository<User, Integer>, JpaSpecificationExecutor<User> {
    User findByUsername(String username);
    User getByUserId(Integer userId);
    User findByUsernameAndPassword(String username,String password);

    Page<User> findAll(Pageable page);
    Page<User> findByUsernameContainingIgnoreCase(String username, Pageable page);
    Page<User> findByEmailContainingIgnoreCase(String email, Pageable page);
    Page<User> findByFullNameContainingIgnoreCase(String fullName, Pageable page);


    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

}
