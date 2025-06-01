<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectDocument extends Model
{


    protected $fillable = [
        'client_id',
        'document_proof',
        'created_by',
        'updated_by',
    ];
    

    /**
     * Get the client that owns the ProjectDocument
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

}
