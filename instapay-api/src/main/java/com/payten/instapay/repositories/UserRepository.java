package com.payten.instapay.repositories;

import com.payten.instapay.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface UserRepository extends JpaRepository<User, Integer>, PagingAndSortingRepository<User, Integer> {
    User findByUsername(String username);
    User getByUserId(Integer userId);
    User findByUsernameAndPassword(String username,String password);

    Page<User> findAll(Pageable page);
    Page<User> findByUsernameContaining(String username, Pageable page);
    Page<User> findByEmailContaining(String email, Pageable page);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

}
