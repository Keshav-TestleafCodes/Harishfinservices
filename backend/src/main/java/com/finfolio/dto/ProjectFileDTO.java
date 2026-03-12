package com.finfolio.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProjectFileDTO {
    private Long id;
    private String originalFilename;
    private String fileType;
    private Long fileSize;
    private String contentType;
    private LocalDateTime uploadedAt;
}
