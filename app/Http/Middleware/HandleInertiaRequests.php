<?php

namespace App\Http\Middleware;

use App\Models\Batch;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $psychologistNotif = null;
        if ($user && $user->role === 'psychologist') {
            $psychologistNotif = Batch::where('assigned_psychologist_id', $user->id)
                ->whereHas('entries', fn ($q) => $q->whereNotNull('used_at'))
                ->whereHas('entries.screening', fn ($q) => $q->where('status', 'Menunggu Evaluasi'))
                ->count();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,

                'subjects' => $user
                    ? $user->subjects()->select('id', 'name', 'age')->get()
                    : [],

                'permissions' => $user
                    ? $request->user()->getAllPermissions()->pluck('name')
                    : [],

                'notifications' => [
                    'pending_analysis' => $psychologistNotif,
                ],

                'is_impersonating' => $request->session()->has('impersonator_id'),
                'impersonator' => $request->session()->has('impersonator_id')
                    ? User::find($request->session()->get('impersonator_id'))
                    : null,
            ],

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
