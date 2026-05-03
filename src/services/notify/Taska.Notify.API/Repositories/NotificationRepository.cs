using MongoDB.Driver;
using Taska.Notify.API.Entities;

namespace Taska.Notify.API.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly IMongoCollection<Notification> _collection;

    public NotificationRepository(IMongoClient mongoClient, IConfiguration configuration)
    {
        var database = mongoClient.GetDatabase(configuration["MongoDB:DatabaseName"]);
        _collection = database.GetCollection<Notification>("notifications");
                
        var indexKeys = Builders<Notification>.IndexKeys.Ascending(n => n.CreatedAt);
        var indexOptions = new CreateIndexOptions { ExpireAfter = TimeSpan.FromDays(30) };

        _collection.Indexes.CreateOne(new CreateIndexModel<Notification>(indexKeys, indexOptions));
    }

    public async Task AddAsync(Notification notification)
    {
        await _collection.InsertOneAsync(notification);
    }

    public async Task<List<Notification>> GetUnreadByUserAsync(Guid userId)
    {
        return await _collection.Find(n => n.RecipientUserId == userId && !n.IsRead)
                                .SortByDescending(n => n.CreatedAt)
                                .ToListAsync();
    }

    public async Task MarkAsReadAsync(Guid notificationId)
    {
        var update = Builders<Notification>.Update.Set(n => n.IsRead, true);
        await _collection.UpdateOneAsync(n => n.Id == notificationId, update);
    }

    public async Task MarkAllAsReadAsync(Guid userId)
    {
        var update = Builders<Notification>.Update.Set(n => n.IsRead, true);
        await _collection.UpdateManyAsync(n => n.RecipientUserId == userId && !n.IsRead, update);
    }
}