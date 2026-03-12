package com.finfolio.dto;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CreateProjectRequest {
    private String title;
    private String description;
    private String client;
    private String category;
    private String year;
    private String value;
    private List<String> tags;
}
