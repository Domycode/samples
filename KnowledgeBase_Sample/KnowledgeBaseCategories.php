<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * Class KnowledgeBaseCategories
 * @package App
 */
class KnowledgeBaseCategories extends Model
{
    protected $table = 'knowledge_base_categories';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'order'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function knowledgebaseArticles()
    {
        return $this->hasMany('App\KnowledgeBase');
    }

    /**
     * @param $new_order
     */
    public function moveOrder($new_order)
    {
        $current_order = $this->order;
        if ($current_order  < $new_order) {
            $categories = KnowledgeBaseCategories::whereBetween('order', [$current_order , $new_order])->get();
            foreach ($categories as $category) {
                $category->update(['order' => $category->order - 1]);
            }

        } elseif ($current_order  > $new_order) {
            $categories = KnowledgeBaseCategories::whereBetween('order', [$new_order, $current_order ])->get();
            foreach ($categories as $category) {
                $category->update(['order' => $category->order + 1]);
            }

        }
    }

    /**
     * @return bool
     */
    public function canMoveUp()
    {
        return $this->order !== 1;
    }

    /**
     * @return bool
     */
    public function canMoveDown()
    {
        return $this->order < $this::count();
    }
}
