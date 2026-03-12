package com.finfolio.controller;

import com.finfolio.dto.CreateProjectRequest;
import com.finfolio.dto.ProjectDTO;
import com.finfolio.dto.ProjectFileDTO;
import com.finfolio.entity.ProjectFile;
import com.finfolio.repository.ProjectFileRepository;
import com.finfolio.service.FileStorageService;
import com.finfolio.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final FileStorageService fileStorageService;
    private final ProjectFileRepository fileRepository;

    // ---- PUBLIC ENDPOINTS ----

    @GetMapping("/api/projects")
    public ResponseEntity<List<ProjectDTO>> getAllProjects(
            @RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(projectService.getProjectsByCategory(category));
        }
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/api/projects/{id}")
    public ResponseEntity<ProjectDTO> getProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProject(id));
    }

    @GetMapping("/api/files/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) throws IOException {
        ProjectFile pf = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        Resource resource = fileStorageService.loadFile(pf.getStoredFilename());

        String contentType = pf.getContentType();
        if (contentType == null) contentType = "application/octet-stream";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + pf.getOriginalFilename() + "\"")
                .body(resource);
    }

    // ---- ADMIN ENDPOINTS ----

    @PostMapping("/api/admin/projects")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectDTO> createProject(
            @RequestBody CreateProjectRequest request,
            Authentication auth) {
        return ResponseEntity.ok(projectService.createProject(request, auth));
    }

    @PutMapping("/api/admin/projects/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectDTO> updateProject(
            @PathVariable Long id,
            @RequestBody CreateProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/api/admin/projects/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/admin/projects/{id}/files")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectFileDTO> uploadFile(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(projectService.addFile(id, file));
    }

    @DeleteMapping("/api/admin/files/{fileId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId) {
        projectService.deleteFile(fileId);
        return ResponseEntity.noContent().build();
    }
}
