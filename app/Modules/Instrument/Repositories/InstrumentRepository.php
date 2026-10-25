<?php

namespace App\Modules\Instrument\Repositories;

use App\Models\Instrument;

class InstrumentRepository
{
    public function getAll()
    {
        return Instrument::with([
            'instrumentTypes.questions',
        ])
            ->orderByDesc('created_at')
            ->get();
    }

    public function find($id)
    {
        return Instrument::with([
            'instrumentTypes.questions',
        ])->findOrFail($id);
    }

    public function getByName(string $name)
    {
        return Instrument::with(['instrumentTypes.questions'])
            ->where('name', $name)
            ->get();
    }

    public function create(array $data)
    {
        return Instrument::create($data);
    }

    public function update(Instrument $instrument, array $data)
    {
        $instrument->update($data);

        return $instrument;
    }

    public function delete(Instrument $instrument)
    {
        return $instrument->delete();
    }
}
