--Readme document for *Jens Mohr*, *jensm@uci.edu*, *58605064*--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

9.5/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 1.5/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?

    Around 10 hours on and off I would say.

3. What online resources did you consult when completing this assignment? (list specific URLs)

    I prompted claude.ai when I was stuck trying to figure out how the file system worked and to suggest ways to go about things like error prevention and good themes.

4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?

    None.

5. Is there anything special we need to know in order to run your code?

    Nope.

--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?

    I designed it with college students in mind because I am one myself and I know very well how terrible a lot of student's sleep is.

7. Did you design your app specifically for iOS or Android, or both?

    I chose iOS by specifying in main.ts. This helped with styling conventions like the swiping to delete.

8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?

    On the "log" tab under "overnight", the user can pick bedtime and wake times with date/time pickers that default to 11pm at night and 7am today. 
    Loggin the full night in the morning makes sense because you wouldn't always know exactly when you will wake up the night before.

9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?

    On the "log" tab under "sleepiness", the user can pick a rating on the Stanford scale from an action sheet that shows the rating's description
    and a time that defaults to now. Showing the descriptions simply helps the user pick accurately because, at least for me, I would constantly 
    forget what each rating actually means.

10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?

    The "history" tab lists all the entries, newest first, with a moon icon for overnight and a sun icon for sleepiness in the morning and shows 
    sleep duration/scale rating. One combined ordered list makes it easy to see how your sleep and sleepiness develop over time.

11. Which feature choose--using a native device resource, backing up logged data, or both?

    I chose backing up logged data.

12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?

    N/a.

13. If you backed up logged data, where does it back up to?

    It backs to Ionic Storage through an indexedDB in the browser. Entries are loaded when the app starts and saved after each log, delete, or undo.

14. How does your app implement or follow principles of good mobile design?

    The app has a useful initial view with the "log" tab loaded with default values, it uses swiping to delete and an undo to act as the "uh-oh" button, 
    it shows error messages when selecting impossible wake times and doesn't allow selecting future times, and it follows iOS platform conventions.