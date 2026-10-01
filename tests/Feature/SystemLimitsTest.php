<?php

namespace Tests\Feature;

use App\Models\DebridDownload;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class SystemLimitsTest extends TestCase
{
    use RefreshDatabase;

    public function test_superadmin_can_update_system_limits(): void
    {
        config(['services.superuser.username' => 'superadmin']);

        $superUser = User::factory()->create([
            'username' => 'superadmin',
        ]);

        $response = $this->actingAs($superUser)->postJson('/settings', [
            'max_concurrent_links' => 3,
            'max_filesize_mb' => 5000,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'systemLimits' => [
                    'max_concurrent_links' => 3,
                    'max_filesize_mb' => 5000,
                ],
            ]);

        $this->assertEquals('3', Setting::get('max_concurrent_links'));
        $this->assertEquals('5000', Setting::get('max_filesize_mb'));
    }

    public function test_non_superadmin_cannot_update_system_limits(): void
    {
        $regularUser = User::factory()->create([
            'username' => 'regular_user',
        ]);

        $response = $this->actingAs($regularUser)->postJson('/settings', [
            'max_concurrent_links' => 5,
        ]);

        $response->assertStatus(403);
    }

    public function test_max_concurrent_links_limit_zero_blocks_submissions(): void
    {
        Setting::set('max_concurrent_links', 0);

        $regularUser = User::factory()->create([
            'username' => 'regular_user',
        ]);

        $response = $this->actingAs($regularUser)->postJson('/downloads', [
            'link' => 'https://mega.nz/file/12345678#abcdefgh',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);

        $this->assertStringContainsString('0', $response->json('message'));
    }

    public function test_max_concurrent_links_limit_blocks_exceeding_active_downloads(): void
    {
        Setting::set('max_concurrent_links', 1);

        $user = User::factory()->create();

        // Create 1 active pending download for this user
        DebridDownload::create([
            'uuid' => (string) Str::uuid(),
            'user_id' => $user->id,
            'original_link' => 'https://mega.nz/file/11111111#aaaaaaa',
            'link_hash' => md5('https://mega.nz/file/11111111#aaaaaaa'),
            'status' => 'downloading',
        ]);

        // Attempting to add a 2nd link should fail
        $response = $this->actingAs($user)->postJson('/downloads', [
            'link' => 'https://mega.nz/file/22222222#bbbbbbb',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_superadmin_is_exempt_from_concurrent_limit(): void
    {
        config(['services.superuser.username' => 'superadmin']);

        Setting::set('max_concurrent_links', 0);

        $superUser = User::factory()->create([
            'username' => 'superadmin',
        ]);

        $response = $this->actingAs($superUser)->postJson('/downloads', [
            'link' => 'https://mega.nz/file/12345678#abcdefgh',
        ]);

        $response->assertSuccessful();
    }
}
