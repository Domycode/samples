<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

/**
 * Class Tickets
 * @package App
 */
class Tickets extends Model
{
    const STATUS_ACTIVE = 1;

    const STATUS_NOT_ACTIVE = 2;

    protected $table = 'tickets';

    public $timestamps = true;

    protected $fillable = [
        'subject', 'server_id', 'user_id', 'description', 'status'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function server()
    {
        return $this->belongsTo('App\Server', 'server_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function replies()
    {
        return $this->hasMany('App\TicketsReplies', 'ticket_id', 'id');
    }


    public function closeTicket()
    {
        $this->update([
            'status' => self::STATUS_NOT_ACTIVE
        ]);
    }

    /**
     * @return bool
     */
    public function isOpen()
    {
        return $this->status == self::STATUS_ACTIVE;
    }

    /**
     * @return bool
     */
    public function isClosed()
    {
        return $this->status == self::STATUS_NOT_ACTIVE;
    }

    public function changeStatus()
    {
        $this->update([
            'status' => $this->isOpen() ? self::STATUS_NOT_ACTIVE : self::STATUS_ACTIVE
        ]);
    }
}
