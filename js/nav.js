"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $favoriteStories.hide();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

function favoriteStory(evt) {
  evt.preventDefault();
  hidePageComponents();
  $favoriteStories.show();
  $submitStory.hide();

}
$navFavorite.on("click", favoriteStory)

function myStories(evt) {
  console.debug(myStories)
  evt.preventDefault();
  hidePageComponents();
  $ownStories.show();
  $favoriteStories.hide();
}

$navStories.on('click', myStories)

function navSubmit() {
  $('#submit-story').show();
  $allStoriesList.hide();
  $favoriteStories.hide();
}
$navSubmit.on('click', navSubmit)