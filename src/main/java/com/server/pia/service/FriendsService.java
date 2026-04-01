package com.server.pia.service;

import com.server.pia.dto.FriendActivityDTO;
import com.server.pia.dto.LastFmRecentTrackDTO;
import com.server.pia.entity.Friends;
import com.server.pia.entity.Reviews;
import com.server.pia.entity.User;
import com.server.pia.repository.FriendsRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class FriendsService {

    private final FriendsRepository friendsRepository;
    private final ReviewsService reviewsService;
    private final LastFmService lastFmService;

    public FriendsService(FriendsRepository friendsRepository, ReviewsService reviewsService, LastFmService lastFmService) {
        this.friendsRepository = friendsRepository;
        this.reviewsService = reviewsService;
        this.lastFmService = lastFmService;
    }

    public List<FriendActivityDTO> getFriendActivityForUser(Long userId) {
        return friendsRepository.findByUserUserId(userId)
                .stream()
                .map(Friends::getFriendUser)
            .filter(friendUser -> friendUser != null)
                .map(this::toFriendActivity)
            .sorted(
                Comparator
                    .comparing(FriendActivityDTO::getReviewDate, Comparator.nullsLast(Comparator.reverseOrder()))
                    .thenComparing(dto -> dto.getUserId() == null ? Long.MAX_VALUE : dto.getUserId())
            )
                .toList();
    }

    private FriendActivityDTO toFriendActivity(User friendUser) {
        Reviews latestReview = reviewsService.getLatestReviewForUser(friendUser);
        LastFmRecentTrackDTO recentTrack = lastFmService
                .getMostRecentTrack(friendUser.getLastfmUsername())
                .orElse(null);

        FriendActivityDTO dto = new FriendActivityDTO();
        dto.setUserId(friendUser.getUserId());
        dto.setUsername(friendUser.getUsername());
        dto.setProfilePicture(friendUser.getProfile_picture());

        if (recentTrack != null) {
            dto.setSongTitle(recentTrack.getTrackName());
            dto.setSongArtist(recentTrack.getArtistName());
            dto.setAlbumName(recentTrack.getAlbumName());
            dto.setAlbumImage(recentTrack.getAlbumImage());
            dto.setReviewDate(recentTrack.getPlayedAt());
            dto.setIsListeningNow(recentTrack.isNowPlaying());
            dto.setRating(null);
            dto.setReviewText(null);
        } else if (latestReview != null) {
            dto.setSongTitle(latestReview.getMusic() != null ? latestReview.getMusic().getName() : null);
            dto.setSongArtist(
                    latestReview.getMusic() != null && latestReview.getMusic().getArtist() != null
                            ? latestReview.getMusic().getArtist().getName()
                            : null
            );
            dto.setAlbumName(latestReview.getMusic() != null ? latestReview.getMusic().getName() : null);
            dto.setAlbumImage(latestReview.getMusic() != null ? latestReview.getMusic().getCoverImage() : null);
            dto.setReviewDate(latestReview.getReviewDate() != null ? latestReview.getReviewDate().toString() : null);
            dto.setIsListeningNow(false);
            dto.setRating(latestReview.getRating());
            dto.setReviewText(latestReview.getReviewText());
        } else {
            dto.setIsListeningNow(false);
        }

        return dto;
    }
}