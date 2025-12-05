# Admin Power Guide - Community Section

## Admin Email
**Admin:** `sankalpgupta7860@gmail.com`

This email has special administrative privileges in the Community section.

## Admin Powers

### 1. Delete Any Post
- The admin can delete **any post** created by any user
- Regular users can only delete their own posts
- Delete button (trash icon) appears on all posts for admin

### 2. Delete Any Comment
- The admin can delete **any comment** made by any user
- Regular users can only delete their own comments
- Delete button (trash icon) appears on all comments for admin

### 3. Visual Indicators
The admin account has special visual badges:

#### Header Badge
- When logged in as admin, an **"ADMIN"** badge appears next to "Community" in the header
- White badge on gradient background

#### Post Badge
- Admin's posts show an **"ADMIN"** badge next to the username
- Blue badge with white text

#### Comment Badge
- Admin's comments show a smaller **"ADMIN"** badge next to the username
- Blue badge with white text

## How It Works

### Code Implementation
The admin system is implemented with:
```typescript
const ADMIN_EMAIL = 'sankalpgupta7860@gmail.com';
const isAdmin = user?.email === ADMIN_EMAIL;
```

### Delete Button Logic
**For Posts:**
```typescript
{(post.user_email === user?.email || isAdmin) && (
  <DeleteButton />
)}
```

**For Comments:**
```typescript
{(comment.user_email === user?.email || isAdmin) && (
  <DeleteButton />
)}
```

## Admin Responsibilities

As admin, you should:
1. **Monitor Content**: Review posts and comments for inappropriate content
2. **Moderate Community**: Remove spam, offensive, or harmful posts/comments
3. **Set Example**: Post constructive and helpful content
4. **Be Fair**: Use delete powers responsibly and only when necessary

## Security Notes

- Admin privileges are determined by email match (client-side)
- For production apps, implement proper server-side role-based access control
- Consider adding an admin panel for better moderation tools
- Log admin actions for transparency and accountability

## Future Enhancements

Consider adding:
- Multiple admin support
- Ban/suspend users
- Edit posts/comments (not just delete)
- Admin activity logs
- Report system for users to flag content
- Admin dashboard with statistics
- Approval queue for flagged content
