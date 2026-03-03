package com.server.pia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TrackResponse {
    private String id;
    private String name;
    private String artist;
    private String imageUrl;
    private String previewUrl;
}