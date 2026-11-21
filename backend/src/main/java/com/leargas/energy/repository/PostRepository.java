package com.leargas.energy.repository;

import com.leargas.energy.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Optional<Post> findBySlug(String slug);

    Optional<Post> findBySlugAndStatus(String slug, String status);

    Page<Post> findByStatus(String status, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE (:category IS NULL OR p.category = :category) AND (:status IS NULL OR p.status = :status)")
    Page<Post> searchPosts(@Param("category") String category, @Param("status") String status, Pageable pageable);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    long countByStatus(String status);

    long countByCategory(String category);
}
