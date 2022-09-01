public with sharing class Article {
    public String id;

    public Source source;
    public String author;
    public String title;
    public String description;
    public String url;//external ID ?
    public String urlToImage;
    public String publishedAt;
    public String content;

    // przed zapisaniem w ulubionych:
    public String status;
    public String country;
    public String category;
    public List<Comment> comments;//declared in constructor
}