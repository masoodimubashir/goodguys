<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientAccount extends Model
{

    public $timestamps = false;

    protected $fillable = [
        'payment_type',
        'payment_flow',
        'amount',
        'narration',
        'client_id',
        'created_at',
        'updated_at'

    ];


    /**
     * Get the client that owns the ClientAccount
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
