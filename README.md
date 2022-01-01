#  📓 EmojiNotes Worker 👷

Cloudflare Workers that handles posts for EmojiNotes.

## GET /
Returns all posts in Workers KV(array of JSON).

## POST /
Add JSON of EmojiNotes Post to Workers KV. If the post has valid expiration, it will add to KV with an expiring key.

## DELETE / 
Remove post with a given key

