<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    //locations
    protected $table = 'location';
    protected $fillable = [
        'name',
        'address_address',
        'address_latitude',
        'address_longitude',
    ];

    public $timestamps = false;
}
