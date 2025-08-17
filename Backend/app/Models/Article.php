<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'content',
        'slug',
        'excerpt',
        'status',
        'featured_image',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [];

    /**
     * Boot method to handle model events
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate slug when creating article
        static::creating(function ($article) {
            if (empty($article->slug)) {
                $article->slug = static::generateUniqueSlug($article->title);
            }
            
            // Auto-generate excerpt if not provided
            if (empty($article->excerpt)) {
                $article->excerpt = static::generateExcerpt($article->content);
            }
        });

        // Update slug when title changes
        static::updating(function ($article) {
            if ($article->isDirty('title') && empty($article->slug)) {
                $article->slug = static::generateUniqueSlug($article->title);
            }
            
            // Update excerpt if content changes and excerpt is empty
            if ($article->isDirty('content') && empty($article->excerpt)) {
                $article->excerpt = static::generateExcerpt($article->content);
            }
        });
    }

    /**
     * Get the user that owns the article
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category that the article belongs to
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the collections that contain this article
     */
    public function collections()
    {
        return $this->belongsToMany(Collection::class, 'collection_articles');
    }

    /**
     * Get the topics associated with this article
     */
    public function topics()
    {
        return $this->belongsToMany(Topic::class, 'article_topics');
    }

    /**
     * Scope to get only published articles
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope to get only draft articles
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * Scope to get articles by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to search articles
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('content', 'like', "%{$search}%")
              ->orWhere('excerpt', 'like', "%{$search}%");
        });
    }

    /**
     * Scope to get articles by category
     */
    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Scope to get articles by user
     */
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Generate unique slug from title
     */
    public static function generateUniqueSlug($title)
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Generate excerpt from content
     */
    public static function generateExcerpt($content, $length = 150)
    {
        $text = strip_tags($content);
        if (strlen($text) <= $length) {
            return $text;
        }

        $excerpt = substr($text, 0, $length);
        $lastSpace = strrpos($excerpt, ' ');
        
        if ($lastSpace !== false) {
            $excerpt = substr($excerpt, 0, $lastSpace);
        }

        return $excerpt . '...';
    }

    /**
     * Get the route key for the model
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Check if article is published
     */
    public function isPublished()
    {
        return $this->status === 'published';
    }

    /**
     * Check if article is draft
     */
    public function isDraft()
    {
        return $this->status === 'draft';
    }

    /**
     * Check if article is deleted
     */
    public function isDeleted()
    {
        return $this->status === 'deleted';
    }

    /**
     * Publish the article
     */
    public function publish()
    {
        $this->update(['status' => 'published']);
        return $this;
    }

    /**
     * Make the article draft
     */
    public function makeDraft()
    {
        $this->update(['status' => 'draft']);
        return $this;
    }

    /**
     * Soft delete the article by changing status
     */
    public function softDelete()
    {
        $this->update(['status' => 'deleted']);
        return $this;
    }

    /**
     * Get reading time in minutes
     */
    public function getReadingTimeAttribute()
    {
        $wordCount = str_word_count(strip_tags($this->content));
        $readingTime = ceil($wordCount / 200); // Average reading speed: 200 words per minute
        return max(1, $readingTime);
    }

    /**
     * Get word count
     */
    public function getWordCountAttribute()
    {
        return str_word_count(strip_tags($this->content));
    }

    /**
     * Get formatted created date
     */
    public function getFormattedCreatedAtAttribute()
    {
        return $this->created_at->format('M d, Y');
    }

    /**
     * Get formatted updated date
     */
    public function getFormattedUpdatedAtAttribute()
    {
        return $this->updated_at->format('M d, Y');
    }
}
