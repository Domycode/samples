<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

/**
 * Class KnowledgeBase
 * @package App
 */
class KnowledgeBase extends Model
{
    use Searchable;

    protected $table = 'knowledge_base';

    public $timestamps = true;

    protected $fillable = [
        'content',
        'header',
        'knowledge_base_categories_id',
        'order'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category()
    {
        return $this->belongsTo('App\KnowledgeBaseCategories', 'knowledge_base_categories_id');
    }
}
