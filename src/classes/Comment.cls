/**
 * Created by przemyslaw.babel on 31.08.2022.
 */

public with sharing class Comment {
    @AuraEnabled
    public String commentText;
    @AuraEnabled
    public Integer rating;
}