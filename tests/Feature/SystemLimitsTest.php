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

    public function test_completed_downloads_count_towards_limit_and_deleting_allows_new_link(): void
    {
        Setting::set('max_concurrent_links', 2);

        $user = User::factory()->create();

        // Create 2 completed downloads in user's list
        $d1 = DebridDownload::create([
            'uuid' => (string) Str::uuid(),
            'user_id' => $user->id,
            'original_link' => 'https://mega.nz/file/11111111#aaaaaaa',
            'link_hash' => md5('https://mega.nz/file/11111111#aaaaaaa'),
            'status' => 'completed',
        ]);

        DebridDownload::create([
            'uuid' => (string) Str::uuid(),
            'user_id' => $user->id,
            'original_link' => 'https://mega.nz/file/22222222#bbbbbbb',
            'link_hash' => md5('https://mega.nz/file/22222222#bbbbbbb'),
            'status' => 'completed',
        ]);

        // Attempting to add a 3rd link should fail because list capacity (2) is full
        $response = $this->actingAs($user)->postJson('/downloads', [
            'link' => 'https://mega.nz/file/33333333#ccccccc',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);

        // Delete 1 download from user's list
        $d1->delete();

        // Now adding a new link should succeed
        $response2 = $this->actingAs($user)->postJson('/downloads', [
            'link' => 'https://mega.nz/file/33333333#ccccccc',
        ]);

        $response2->assertSuccessful();
    }

    public function test_multilink_submission_takes_up_to_limit_and_ignores_rest(): void
    {
        Setting::set('max_concurrent_links', 2);

        $user = User::factory()->create();

        // Submit 4 links at once when limit is 2
        $links = implode("\n", [
            'https://mega.nz/file/11111111#aaaaaaa',
            'https://mega.nz/file/22222222#bbbbbbb',
            'https://mega.nz/file/33333333#ccccccc',
            'https://mega.nz/file/44444444#ddddddd',
        ]);

        $response = $this->actingAs($user)->postJson('/downloads', [
            'link' => $links,
        ]);

        $response->assertSuccessful()
            ->assertJson([
                'success' => true,
                'count' => 2,
                'ignored_count' => 2,
            ]);

        // Verify only 2 links were added to DB for this user
        $this->assertEquals(2, DebridDownload::where('user_id', $user->id)->count());
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
