package com.finfolio.repository;

import com.finfolio.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.files LEFT JOIN FETCH p.createdBy ORDER BY p.createdAt DESC")
    List<Project> findAllWithFiles();

    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.files WHERE p.category = :category ORDER BY p.createdAt DESC")
    List<Project> findByCategoryWithFiles(String category);
}
