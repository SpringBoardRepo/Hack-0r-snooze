"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {

  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
        ${showStar ? getStar(story) : ""}
         <a href="${story.url}" target="a_blank" class="story-link">
          <b>${story.title}</b>
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
  
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug(putStoriesOnPage);

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  $submitStory.hide();
}

function getStar(story) {
  const isFavorite = User.isFavorite(story)
  const favorite = isFavorite ? "fas" : "far"
  return `<span class="star">
   <i class="${favorite} fa-star"></i>
   </span>`
}

function showFavoriteStories() {
  console.debug(showFavoriteStories)
  if (currentUser.favorites.length === 0) {
    $favoriteStories.empty();
    $favoriteStories.append(`<h5>Nothing has been added</h5>`)
  }
  else {
    $favoriteStories.empty();
    for (let fav of currentUser.favorites) {
      const favStory = generateStoryMarkup(fav);
      $favoriteStories.append(favStory);
    }
  }
}

/**Allow user to add favorite story and toggle */
async function toggleFavoriteStory(evt) {
  console.debug(toggleFavoriteStory)
  const $target = $(evt.target);
  const $targetLi = $target.closest('li');
  const $targetId = $targetLi.attr('id');


  if ($target.hasClass('fas')) {
    await User.removeFavoriteStory($targetId);
    $target.closest('i').toggleClass('fas far')

  }
  else {
    await User.addFavoriteStory($targetId);
    $target.closest('i').toggleClass('fas far');
    const story = storyList.stories.find(s => s.storyId === $targetId)
    currentUser.favorites.push(story);

  }
}
$body.on('click', 'span', toggleFavoriteStory)

/*show user-own stories*/
function showUserStories() {
  if (currentUser.ownStories.length > 0) {
    $ownStories.empty();
    for (let story of currentUser.ownStories) {
      let $myStory = generateStoryMarkup(story);
      $myStory.prepend(`<i class="fas fa-trash-alt"></i>`)
      $ownStories.append($myStory);
    }
  } else {
    $ownStories.append(`<h5>Nothing to See Here!</h5>`);
  }
  $ownStories.show();
}

/**Delete a story from API and UI on click */

async function deleteStory(e) {

  const parentLI = $(e.target).parent();
  const parentId = parentLI.attr('id');

  await storyList.deleteStoryFromApi(currentUser, parentId)
  parentLI.remove();
  showUserStories();
  showFavoriteStories();
}

$('body').on('click', 'i', deleteStory)

/**Submit user stories */
async function submitStory(evt) {
  console.debug(submitStory)
  evt.preventDefault();

  const storyTitle = $('#story-text').val();
  const storyUrl = $('#story-url').val();
  const storyAuthor = $('#story-author').val();
  const username = currentUser.username;

  const storyData = { storyTitle, storyUrl, storyAuthor, username }
  const story = await storyList.addStory(currentUser, storyData)

  const $showStory = generateStoryMarkup(story);
  $allStoriesList.prepend($showStory);
  showUserStories();
  $submitStoryForm.trigger("reset");
  $allStoriesList.show();
  $submitStory.hide();
}

$submitStoryForm.on('click', submitStory)