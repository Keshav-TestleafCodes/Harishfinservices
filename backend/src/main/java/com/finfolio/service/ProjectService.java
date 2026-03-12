package com.finfolio.service;

import com.finfolio.dto.CreateProjectRequest;
import com.finfolio.dto.ProjectDTO;
import com.finfolio.dto.ProjectFileDTO;
import com.finfolio.entity.Project;
import com.finfolio.entity.ProjectFile;
import com.finfolio.entity.User;
import com.finfolio.repository.ProjectFileRepository;
import com.finfolio.repository.ProjectRepository;
import com.finfolio.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectFileRepository fileRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAllWithFiles().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProjectDTO> getProjectsByCategory(String category) {
        return projectRepository.findByCategoryWithFiles(category).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProjectDTO getProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return toDTO(project);
    }

    @Transactional
    public ProjectDTO createProject(CreateProjectRequest request, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .client(request.getClient())
                .category(request.getCategory())
                .year(request.getYear())
                .value(request.getValue())
                .tags(request.getTags())
                .createdBy(user)
                .files(new ArrayList<>())
                .build();

        return toDTO(projectRepository.save(project));
    }

    @Transactional
    public ProjectDTO updateProject(Long id, CreateProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setClient(request.getClient());
        project.setCategory(request.getCategory());
        project.setYear(request.getYear());
        project.setValue(request.getValue());
        project.setTags(request.getTags());

        return toDTO(projectRepository.save(project));
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Delete physical files
        if (project.getFiles() != null) {
            project.getFiles().forEach(f -> fileStorageService.deleteFile(f.getStoredFilename()));
        }
        projectRepository.delete(project);
    }

    @Transactional
    public ProjectFileDTO addFile(Long projectId, MultipartFile file) throws IOException {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        String storedFilename = fileStorageService.storeFile(file);
        String fileType = fileStorageService.detectFileType(file.getOriginalFilename());

        ProjectFile pf = ProjectFile.builder()
                .originalFilename(file.getOriginalFilename())
                .storedFilename(storedFilename)
                .fileType(fileType)
                .fileSize(file.getSize())
                .contentType(file.getContentType())
                .project(project)
                .build();

        return toFileDTO(fileRepository.save(pf));
    }

    @Transactional
    public void deleteFile(Long fileId) {
        ProjectFile pf = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        fileStorageService.deleteFile(pf.getStoredFilename());
        fileRepository.delete(pf);
    }

    private ProjectDTO toDTO(Project p) {
        List<ProjectFileDTO> fileDTOs = p.getFiles() == null ? List.of() :
                p.getFiles().stream().map(this::toFileDTO).collect(Collectors.toList());

        return ProjectDTO.builder()
                .id(p.getId())
                .title(p.getTitle())
                .description(p.getDescription())
                .client(p.getClient())
                .category(p.getCategory())
                .year(p.getYear())
                .value(p.getValue())
                .tags(p.getTags())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .createdBy(p.getCreatedBy() != null ? p.getCreatedBy().getUsername() : null)
                .files(fileDTOs)
                .build();
    }

    private ProjectFileDTO toFileDTO(ProjectFile pf) {
        return ProjectFileDTO.builder()
                .id(pf.getId())
                .originalFilename(pf.getOriginalFilename())
                .fileType(pf.getFileType())
                .fileSize(pf.getFileSize())
                .contentType(pf.getContentType())
                .uploadedAt(pf.getUploadedAt())
                .build();
    }
}
