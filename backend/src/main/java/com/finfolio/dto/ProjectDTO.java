package com.finfolio.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProjectDTO {
    private Long id;
    private String title;
    private String description;
    private String client;
    private String category;
    private String year;
    private String value;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private List<ProjectFileDTO> files;
}
