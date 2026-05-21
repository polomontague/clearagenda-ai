# Scheduling Pipeline Business Logic

## General
The user object in the UserContext provides user.preferences.hours which are used to know how many hours to schedule for the weekday according to the local time on the client. These are hard caps.
{
	monday: number,
	tuesday: number,
	wednesday: number,
	thursday: number,
	friday: number,
	saturday: number
}
* All times use minute precision. Seconds and milliseconds are normalized to 0 at the API boundary.

1. Tasks
    * Bound by days as experiences by the user in their local timezone.
    * Flexible and scheduled into empty time in the day
    * Uses capacity-based daily scheduling model, not a time-slot model. A day is a fixed pool of dedicated time as dictated by the user.preferences.hours[weekday] (weekday is the current day of the week in the client’s local time).
    * Tasks Have steps
    * Steps are ordered and must stay in that order
    * A step is atomic. It is never split across multiple days.
    * Steps have a duration (in minutes)
    * Completed steps are no longer schedulable.
    * Completed steps are shown on the day they were completed and still occupy space according to their duration.
    * Steps should be added to days with their task wrapped around them Example: { id: 1, steps: [only steps of this task that fit in this day]}
    * Place each step into the earliest day that it fits.
    * A step fits if its duration plus the calculated duration of all the other items already added to the day (event durations + task step durations) are less than or equal to the user’s hours preference for the current weekday in the client’s local timezone.
    * If a step doesn’t fit in a day, carry it on to the next day that it fits.
    * Task steps begin filling in extra time starting on the current date in user local time. No incomplete steps should be added to days in the past.
    1. One-Time Task
        * task.deadline (optional) “YYYY-MM-DD” interpreted as the last second of the day in user local time on the client at runtime.
        * task.completed optional completed (ISO 8601 timestamp)
        * Added to agenda last in order
    2. Repeating Task
        * Occurrences are computed in user local time via calendar day iteration. stepping through local midnight-to-midnight boundaries in user local timezone
        * Repeating task instances get generated on every repeat date. They then behave like one-time tasks, but an instance doesn’t exist until its repeat date.
        * Repeating tasks completions are stored in a table with step_id, date (YYYY-MM-DD), and completed (ISO 8601 timestamp). (step_id, date) is the unique identifier for the occurrence. date is interpreted in user local time.
        * Optional deadline (days from occurrence start)
        * Each recurrence creates a new eligible instance.
        * The instance is filled using the same step order rules as a one-time task.
        * repeat.starts (when the event starts repeating) is a date (2026-05-04). The date is interpreted as midnight in user local time on the client at runtime.
        * repeat.ends (when the event stops repeating) is an optional date (2026-6-04). The date is interpreted as the last moment of the day (23:59:59.999) in user local time on the client at runtime.
        * Added to agenda third in order
2. Events
    * Blocks time from start to end
    * Belongs to every day it overlaps
    * Has a duration (in minutes)
    * Events are allowed to overlap in time
    1. One-Time Event
        * Starts (absolute ISO 8601 datetime)
        * Ends (derived from Starts & Duration)
        * Added to agenda first in order
    2. Repeating Event
        * Occurrences are computed using event.timezone via calendar day iteration. iteration = stepping through local midnight-to-midnight boundaries in event.timezone
        * event.starts (the time the event starts on each occurrence) is stored as “HH:MM:SS.MMM” in event.timezone
        * Ends (derived from occurrence date & time + event.duration)
        * event.repeat.starts (the date the event starts repeating) is a datetime “YYYY-MM-DD” interpreted as midnight in event.timezone
        * event.repeat.ends (the date the event stops repeating) is a datetime “YYYY-MM-DD” interpreted as the last moment of the day in event.timezone
        * Added to agenda second in order
3. Reminders
    * Reminders are point-in-time notifications
    * Reminders are always in local time
    1. One-Time Reminder
        * reminder.at (user local time) stored as “YYYY-MM-DD HH:MM:SS.MMM”
    2. Repeating Reminder
        * reminder.at (user local time) stored as “HH:MM:SS.MMM”
        * Occurrences are computed in user local time via calendar day iteration. stepping through local midnight-to-midnight boundaries in user local timezone
        * reminder.repeat.starts (when the event starts repeating) is a date (2026-05-04). The date is interpreted as midnight in user local time on the client at runtime.
        * reminder.repeat.ends (when the event stops repeating) is an optional date (2026-6-04). The date is interpreted as the last moment of the day (23:59:59.999) in user local time on the client at runtime.