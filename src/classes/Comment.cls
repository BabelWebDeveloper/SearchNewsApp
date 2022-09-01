/**
 * Created by przemyslaw.babel on 31.08.2022.
 */

public with sharing class Comment {
    public String commentText;
    public Integer rating;
    public Id articleId;
    public Id userId;
    public String username;
}