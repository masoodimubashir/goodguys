<?php

namespace App\Models;

use Carbon\Carbon;
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

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
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

    protected static function booted()
    {
        static::saving(function ($model) {
            if ($model->created_at && strlen($model->created_at) === 10) {
                // User submitted only a date like '2025-06-17'
                $model->created_at = Carbon::parse($model->created_at)
                    ->setTimeFromTimeString(now()->format('H:i:s'));
            }
        });
    }
}
