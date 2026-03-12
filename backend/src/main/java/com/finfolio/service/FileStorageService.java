package com.finfolio.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    private final Path uploadDir;

    public FileStorageService(@Value("${app.upload.dir}") String uploadDirStr) throws IOException {
        this.uploadDir = Paths.get(uploadDirStr).toAbsolutePath().normalize();
        Files.createDirectories(this.uploadDir);
    }

    public String storeFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String storedFilename = UUID.randomUUID().toString() + extension;
        Path targetPath = uploadDir.resolve(storedFilename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        return storedFilename;
    }

    public Resource loadFile(String storedFilename) throws MalformedURLException {
        Path filePath = uploadDir.resolve(storedFilename).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists()) {
            throw new RuntimeException("File not found: " + storedFilename);
        }
        return resource;
    }

    public void deleteFile(String storedFilename) {
        try {
            Path filePath = uploadDir.resolve(storedFilename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.error("Could not delete file: {}", storedFilename, e);
        }
    }

    public String detectFileType(String filename) {
        if (filename == null) return "UNKNOWN";
        String lower = filename.toLowerCase();
        if (lower.endsWith(".pdf")) return "PDF";
        if (lower.endsWith(".pptx") || lower.endsWith(".ppt")) return "PPTX";
        if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) return "XLSX";
        return "OTHER";
    }
}
