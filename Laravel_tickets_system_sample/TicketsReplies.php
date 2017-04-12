<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TicketsReplies
 * @package App
 */
class TicketsReplies extends Model
{
    const FROM_SUPPORT_TEAM = 1;

    const FROM_USER = 2;

    protected $table = 'tickets_replies';

    public $timestamps = true;

    protected $fillable = [
        'ticket_id', 'reply', 'from'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function ticket()
    {
        return $this->belongsTo('App\Tickets');
    }

    /**
     * @return bool
     */
    public function fromUser()
    {
        return $this->from == self::FROM_USER;
    }

    /**
     * @return bool
     */
    public function fromSupport()
    {
        return $this->from == self::FROM_SUPPORT_TEAM;
    }
}
