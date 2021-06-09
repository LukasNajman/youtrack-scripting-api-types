/**
 * This module contains functions that let you work with dates and times.
 */
declare module "@jetbrains/youtrack-scripting-api/date-time" {
  // org.joda.time.Period
  export interface Period {
    getYears(): number;
    getMonths(): number;
    getWeeks(): number;
    getDays(): number;
    getHours(): number;
    getMinutes(): number;
    getSeconds(): number;
    getMillis(): number;

    minus(period: Period): Period;
    minusDays(days: number): Period;
    minusHours(hours: number): Period;
    minusMillis(millis: number): Period;

    // TODO add all joda-time Period methods
  }

  export enum Timezone {
    UTC = "UTC",
    CET = "CET",
    MET = "MET",
    EET = "EET",
  }

  /**
   * Parses a string representation of a date to return a Unix timestamp. Use this method instead of the Date.parse()
   * method from JavaScript. For a detailed explanation, refer to the MDN documentation
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse.
   * @param dateTimeString The string representation of a date.
   * @param formats A date format that possibly matches the dateTimeString or an array of formats. If an array
   * is provided, the formats are applied sequentially until the dateTimeString is parsed successfully. If no value
   * is specified, the date format is supplied by the system. For actions that are attributed to the current user,
   * the date format setting from the profile for the current user is applied. For actions that are attributed
   * to the workflow user account, the global date fields format setting is applied. For format description,
   * see https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/SimpleDateFormat.html.
   * @param timeZoneId The ID of a time zone in which the dateTimeString occurs. This parameter is only effective when
   * the format that matches the string does not provide any timestamp information. If neither the format that
   * successfully matches the string nor this parameter provide the time zone, the time zone is supplied by the system.
   * For actions that are attributed to the current user, the local time zone setting from the profile for the current
   * user is applied. For actions that are attributed to the workflow user account, the global default time zone
   * is applied. For a list of time zone IDs, see http://joda-time.sourceforge.net/timezones.html.
   * @returns A timestamp representation of the specified string.
   */
  export function parse(
    dateTimeString: string,
    formats: string | string[],
    timeZoneId: Timezone
  ): number;

  /**
   * Creates a string representation of a Unix timestamp.
   * @param timestamp The timestamp to format as a string.
   * @param format The date format to apply to the output. If no value is specified, the date format is supplied
   * by the system. For actions that are attributed to the current user, the date format setting from the profile
   * for the current user is applied. For actions that are attributed to the workflow user account, the global date
   * fields format setting is applied. For format description, see https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/SimpleDateFormat.html.
   * @param timeZoneId The ID of a time zone. Applies an offset to the original timestamp, which is in UTC.
   * If no value is specified, the time zone is supplied by the system. For actions that are attributed to the current
   * user, the local time zone setting from the profile for the current user is applied. For actions that
   * are attributed to the workflow user account, the global default time zone is applied.
   * For a list of time zone IDs, see http://joda-time.sourceforge.net/timezones.html.
   * @returns A string representation of the specified timestamp.
   */
  export function format(
    timestamp: number | string,
    format: string,
    timeZoneId: Timezone
  ): string;

  /**
   * Creates a period representation of an argument.
   * @param period A duration in milliseconds as either a number or a string. The string representation is a series
   * of numeric values followed by the abbreviation that represents the timespan, in descending order.
   * For example, 1m3w4d23h58m.
   * @returns The period representation of the specified argument.
   */
  export function toPeriod(period: number | string): Period;

  /**
   * Returns a timestamp that represents a point in time after the specified period from the specified date.
   * @param base The base date value.
   * @param duration A duration as a number (in milliseconds), string representation, or period as retrieved from
   * a custom field or returned by the toPeriod() function. The string representation is a series of numeric values
   * followed by the abbreviation that represents the timespan, in descending order. For example, 1m3w4d23h58m.
   * @returns The resulting timestamp.
   * @since 2018.2.42881
   */
  export function after(
    base: number | string | Period,
    duration: number | string | Period
  ): number;

  /**
   * Returns a timestamp that represents a point in time before the specified period from the specified date.
   * @param base The base date value.
   * @param duration A duration as a number (in milliseconds), string representation, or period as retrieved from
   * a custom field or returned by the toPeriod() function. The string representation is a series of numeric values
   * followed by the abbreviation that represents the timespan, in descending order. For example, 1m3w4d23h58m.
   */
  export function before(
    base: number | string | Period,
    duration: number | string | Period
  ): number;
}

declare module "@jetbrains/youtrack-scripting-api/notifications" {
  import { Issue } from "@jetbrains/youtrack-scripting-api/entities";

  interface EmailMessage {
    fromName: string;
    toEmails: string[];
    subject: string;
    body: string;
  }

  export function sendEmail(message: EmailMessage, issue: Issue<unknown>): void;
}

declare module "@jetbrains/youtrack-scripting-api/search" {
  import {
    User,
    Issue,
    Set,
    Fields,
    IssueFolder,
  } from "@jetbrains/youtrack-scripting-api/entities";

  /**
   * Searches for issues that match a search query.
   * If a sort order is not specified explicitly in the query, the issues that are returned are sorted in random order.
   * The set of issues that is returned excludes issues that the specified user does not have permission to view.
   * If the value for this parameter is not provided, the search query is executed on behalf of the current user.
   *
   * @param folder The project, tag, or saved search to set as the search context.
   *     If the value for this parameter is not provided, the search includes all issues.
   *     This is equivalent to a search that is performed in the user interface with the context set to Everything.
   * @param query A YouTrack search query.
   * @param user The user account that executes the search query.
   * @returns A set of Issues that match a search query.
   */
  export function search<F extends Fields>(
    folder: IssueFolder, // jetbrains define this as WatchFolder, but that is incompatible with Issue.project, which is subtype of IssueFolder, not WatchFolder
    query: string,
    user?: User | undefined
  ): Set<Issue<F>>;
}

declare module "@jetbrains/youtrack-scripting-api/workflow" {
  /**
   * Displays the specified message in the YouTrack user interface.
   *
   * @param message The message text.
   */
  export function message(message: string): void;

  /**
   * Checks to determine whether the specified condition is true.
   * If the condition is not true, the system throws an error.
   * All changes are rolled back to the initial state..
   * The error contains the specified message, which is displayed in the user interface.
   *
   * @param condition The condition to check.
   * @param message The error message that is shown to the user in cases where the condition is false.
   */
  export function check(condition: boolean, message: string): void;
}

declare module "@jetbrains/youtrack-scripting-api/strings" {
  /**
   * Returns the Levenshtein distance between two strings.
   * Delegates to {@link https://commons.apache.org/proper/commons-text/javadocs/api-release/org/apache/commons/text/similarity/LevenshteinDistance.html|org.apache.commons.text.similarity.LevenshteinDistance}.
   * @param str1 The first string.
   * @param str2 The string that is compared to the first string.
   */
  export function getLevenshteinDistance(str1: string, str2: string): number;
}

declare module "@jetbrains/youtrack-scripting-api/entities" {
  /**
   * A JSON object that defines the properties for the action rule.
   */
  export interface ActionRuleProperties<
    F extends Fields,
    R extends Requirements
  > {
    /**
     * The human-readable name of the rule. Displayed in the administrative UI in YouTrack.
     */
    title: string;

    /**
     * The custom command that triggers the action.
     */
    command: string;

    /**
     * A function that is invoked to determine whether the action is applicable to an issue.
     */
    guard: GuardFunction<F, R>;

    /**
     * The function that is invoked on issue change.
     */
    action: ActionFunction<F, R>;

    /**
     * The set of entities that must be present for the script to work as expected.
     */
    requirements: R;
  }

  /**
   * A JSON object that defines the properties for the on change rule.
   */
  export interface OnChangeRuleProperties<
    F extends Fields,
    R extends Requirements
  > {
    /**
     * The human-readable name of the rule. Displayed in the administrative UI in YouTrack.
     */
    title: string;

    /**
     * A function that is invoked to determine whether the action is applicable to an issue.
     */
    guard: GuardFunction<F, R>;

    /**
     * The function that is invoked on issue change.
     */
    action: ActionFunction<F, R>;

    /**
     * The set of entities that must be present for the script to work as expected.
     */
    requirements: R;

    /**
     * Determines which issue events trigger the on-change rule. When not specified, the rule is triggered on issue change.
     */
    runOn?: RunOnAction;
  }

  /**
   * A JSON object that defines the properties for the on schedule rule.
   */
  export interface OnScheduleRuleProperties<
    F extends Fields,
    R extends Requirements
  > {
    /**
     * The human-readable name of the rule. Displayed in the administrative UI in YouTrack.
     */
    title: string;

    /**
     * A YouTrack search string or a function with no parameters that returns such a string.
     * The specified action is applied to all issues that match the search and belong to the project that this rule is attached to.
     */
    search: string | (() => string);

    /**
     * A cron expression that specifies the interval for applying the rule.
     */
    cron: string;

    /**
     * `true` if no notifications should be sent on changes made by this rule or any rule that reacted on a change made by this rule.
     */
    muteUpdateNotifications: boolean;

    /**
     * The function that is invoked on issue change.
     */
    action: ActionFunction<F, R>;

    /**
     * The set of entities that must be present for the script to work as expected.
     */
    requirements: R;
  }

  /**
   * A JSON object that defines the properties for the state machine rule.
   */
  export interface StateMachineRuleProperties<T extends Requirements> {
    /**
     * The human-readable name of the rule. Displayed in the administrative UI in YouTrack.
     */
    title: string;

    /**
     * The name of a field that is managed by the state-machine rule.
     */
    stateFieldName: string;

    /**
     * A list of values for a custom field and the possible transitions between them.
     */
    defaultMachine?: unknown;

    /**
     * The name of a field that defines which state-machine applies to the managed field.
     */
    typeFieldName?: string;

    /**
     * An object that contains the definitions for one or more state-machines that apply to different types of issues.
     * Object keys are the possible values of the field that is defined by the typeFieldName.
     * Object values have the same structure that is shown for 'states' in the example.
     */
    alternativeMachines?: unknown;

    /**
     * The set of entities that must be present for the script to work as expected.
     */
    requirements: T;
  }

  export interface RunOnAction {
    /**
     * 	When `true`, the rule is triggered on issue change.
     */
    change: boolean;

    /**
     * When `true`, the rule is triggered when an issue is logically deleted.
     */
    removal: boolean;
  }

  /**
   * This function is called to determine whether an action function can be applied to an issue.
   * Guard functions are used in on-change rules, action rules, and in transitions between values of a state-machine rule.
   * On-schedule rules also support guard functions, but this rule type includes a `search` property that has a similar purpose.
   *
   * @param ctx The execution context. Along with the parameters listed below,
   * the context also contains objects that you describe as {@link Requirements}.
   */
  type GuardFunction<F extends Fields, R extends Requirements> = (
    ctx: GuardFunctionContext<F, R>
  ) => boolean;

  type GuardFunctionContext<
    F extends Fields,
    T extends Requirements
  > = GuardFunctionContextInternal<F> & T;

  export interface GuardFunctionContextInternal<F extends Fields> {
    /**
     * The current issue.
     */
    issue: Issue<F>;

    /**
     * The user who executes the rule.
     */
    currentUser: User;
  }

  /**
   * This function is called by different events depending on the rule type:
   * when a change is applied to an issue (on-change rules), when a command is executed (action rules),
   * or according to a predefined schedule (scheduled rules). This function is called separately
   * for each related issue.
   *
   * @param ctx The execution context. Along with the parameters listed below, the context also contains objects that
   *     you describe in the {@link Requirements}.
   */
  type ActionFunction<F extends Fields, R extends Requirements> = (
    ctx: ActionFunctionContext<F, R>
  ) => void;

  type ActionFunctionContext<
    F extends Fields,
    R extends Requirements
  > = ActionFunctionContextInternal<F> & R;

  export interface ActionFunctionContextInternal<F extends Fields> {
    /**
     * The current issue.
     */
    issue: Issue<F>;

    /**
     * The user who executes the rule.
     */
    currentUser: User;

    /**
     * When `true`, the rule is triggered in reaction to a command that is applied without notification.
     * When `false`, the rule is triggered in reaction to a command that is applied normally.
     * @since 2017.4.38771.
     */
    isSilentOperation: boolean;
  }

  // ########################################
  // ############### ENTITIES ###############
  // ########################################

  export interface AbstractVcsItem extends BaseEntity {
    /**
     * The name of the branch that the VCS change was committed to.
     * @since 2018.1.38923
     */
    readonly branch: string;

    /**
     * The commit message or pull request description that was provided when the change was applied to the VCS.
     * @since 2018.1.38923
     */
    readonly text: string;

    /**
     * The user who authored the VCS change.
     * @since 2018.1.38923
     */
    readonly user: User;

    /**
     * The name of the change author, as returned by the VCS.
     * @since 2018.1.38923
     */
    readonly userName: string;
  }

  export interface AgileConstructor {
    /**
     * Returns a set of agile boards that have the specified name.
     * @returns A set of agile boards that are assigned the specified name.
     */
    findByName(name: string): Set<Agile>;
  }

  const Agile: AgileConstructor;

  export interface Agile extends BaseEntity {
    /**
     * The user who created the board.
     */
    readonly author: User;

    /**
     * The name of the agile board.
     */
    readonly name: string;

    /**
     * The set of sprints that are associated with the board.
     */
    readonly sprints: Set<Sprint>;

    /**
     * Finds a specific sprint by name.
     * @param name The name of the sprint.
     * @returns If a sprint with the specified name is found, the corresponding {@link Sprint} object is returned. Otherwise, the return value is null.
     */
    findSprintByName(name: string): Sprint | null;

    /**
     * Returns the sprints that an issue is assigned to on an agile board.
     * @param issue The issue for which you want to get the sprints that it is assigned to.
     * @returns The sprints that the issue is assigned to on the agile board.
     * @since 2018.1.39547
     */
    getIssueSprints(issue: Issue<unknown>): Set<Sprint>;
  }

  export interface BaseComment<F extends Fields> extends BaseEntity {
    /**
     * The set of attachments that are attached to the comment.
     * @since 2018.1.40030
     */
    readonly attachments: Set<IssueAttachment<F>>;

    /**
     * TODO documentation missing
     */
    readonly created: number;

    /**
     * 	When `true`, the comment text is parsed as Markdown. When `false`, the comment text is parsed as YouTrack Wiki.
     * Changing this value does not transform the markup from one syntax to another.
     * @since 2017.4.38870
     */
    readonly isUsingMarkdown: boolean;

    /**
     * TODO documentation missing
     */
    text: string;

    /**
     * TODO documentation missing
     */
    readonly updated: string;
  }

  export class BaseEntity {
    /**
     * When `true`, the entity is removed in the current transaction. Otherwise, `false`.
     * @since 2017.4.37915
     */
    readonly becomesRemoved: boolean;

    /**
     * When `true`, the entity is created in the current transaction. Otherwise, `false`.
     * @since 2018.2.42351
     */
    readonly isNew: boolean;

    /**
     * Checks whether a field is set to an expected value in the current transaction.
     * @param fieldName The name of the field to check.
     * @param expected The expected value.
     * @returns If the field is set to the expected value, returns `true`.
     */
    becomes(fieldName: string, expected: string): boolean;

    /**
     * Checks whether a user has permission to read the field.
     * @param fieldName The name of the field.
     * @param user The user for whom the permission to read the field is checked.
     * @returns If the user can read the field, returns `true`.
     */
    canBeReadBy(fieldName: string, user: User): boolean;

    /**
     * Checks whether a user has permission to update the field.
     * @param fieldName The name of the field.
     * @param user The user for whom the permission to update the field is checked.
     * @returns If the user can update the field, returns `true`.
     */
    canBeWrittenBy(fieldName: string, user: User): boolean;

    /**
     * Checks whether a field is equal to an expected value.
     * @param fieldName The name of the field to check.
     * @param expected The expected value.
     * @returns If the field is equal to the expected value, returns `true`.
     * @since 2019.2.55603
     */
    is(fieldName: string, expected: string): boolean;

    /**
     * Checks whether the value of a field is changed in the current transaction.
     * @param fieldName The name of the field to check.
     * @returns If the value of the field is changed in the current transaction, returns `true`.
     */
    isChanged(fieldName: string): boolean;

    /**
     * Returns the previous value of a single-value field before an update was applied. If the field is not changed in the transaction, returns null.
     * @param fieldName The name of the field.
     * @returns If the field is changed in the current transaction, the previous value of the field. Otherwise, null.
     */
    oldValue(fieldName: string): unknown;

    /**
     * Asserts that a value is set for a field. If a value for the required field is not set, the specified message is displayed in the user interface.
     * @param fieldName The name of the field to check.
     * @param message The message that is displayed to the user that describes the field requirement.
     */
    required(fieldName: string, message: string): void;

    /**
     * Checks whether a field was equal to an expected value prior to the current transaction.
     * @param fieldName The name of the field to check.
     * @param expected The expected value.
     * @returns If the field was equal to the expected value, returns `true`.
     * @since 2019.2.55603
     */
    was(fieldName: string, expected: string): boolean;
  }

  export interface FieldConstructor {
    /**
     * Date and time field type. Used when defining rule requirements.
     */
    readonly dateTimeType: string;

    /**
     * Date field type. Used when defining rule requirements.
     */
    readonly dateType: string;

    /**
     * Float field type. Used when defining rule requirements.
     */
    readonly floatType: string;

    /**
     * Integer field type. Used when defining rule requirements.ts.
     */
    readonly integerType: string;

    /**
     * Period field type. Used when defining rule requirements.
     */
    readonly periodType: string;

    /**
     * String field type. Used when defining rule requirements.
     */
    readonly stringType: string;

    /**
     * Text field type. Used when defining rule requirements.
     */
    readonly textType: string;
  }

  const Field: FieldConstructor;

  /**
   * Represents a value that is stored in a custom field.
   * The custom fields themselves are represented by the Fields class.
   */
  export interface Field extends BaseEntity {
    /**
     * The background color of the value in the custom field as it is displayed in YouTrack.
     */
    readonly backgroundColor: string;

    /**
     * The foreground color of the value in the custom field as it is displayed in YouTrack.
     */
    readonly foregroundColor: string;

    /**
     * The index value of the color that is assigned to the value in the custom field.
     */
    readonly colorIndex: number;

    /**
     * The description of the value as visible in the administrative UI for custom fields.
     */
    readonly description: number;

    /**
     * The name of the value, which is also stored as the value in the custom field.
     */
    readonly name: string;

    /**
     * The position of the value in the set of values for the custom field.
     */
    readonly ordinal: number;

    /**
     * String representation of the value.
     */
    readonly presentation: string;

    /**
     * If the value is archived, this property is `true`.
     */
    readonly isArchived: boolean;
  }

  type FieldType =
    | string
    | IssueTag
    | User
    | UserGroup
    | Project
    | SavedQuery
    | IssueLinkPrototype
    | Issue<unknown>;

  type MultiValueField<T> = Set<T>;

  export interface BaseWorkItem extends BaseEntity {
    /**
     * The user to whom the work is attributed in the work item.
     */
    readonly author: User;

    /**
     * The date when the work item was created.
     */
    readonly created: number;

    /**
     * The user who added the work item to the issue.
     */
    readonly creator: User;

    /**
     * The work item description.
     */
    description: string;

    /**
     * 	When `true`, the comment text is parsed as Markdown. When `false`, the comment text is parsed as YouTrack Wiki.
     * Changing this value does not transform the markup from one syntax to another.
     * @since 2017.4.38870
     */
    readonly isUsingMarkdown: boolean;

    /**
     * The work item type. Writable since 2020.2
     */
    type: WorkItemType;

    /**
     * The date when the work item was last updated.
     */
    readonly updated: string;
  }

  /**
   * Represents a value that is stored in a custom field that stores a build type.
   */
  export interface Build extends Field {
    /**
     * Field type. Used when defining rule requirements.
     */
    readonly fieldType: FieldType;
  }

  /**
   * Represents a custom field in a project that stores an predefined set of values.
   */
  export interface BundleProjectCustomField<T> extends ProjectCustomField {
    // TODO missing fields and methods

    /**
     * The list of available values for the custom field.
     */
    readonly values: Set<T>;
  }

  /**
   * Represents a value in a custom field that stores a predefined set of values.
   */
  export interface EnumField extends Field {
    /**
     * Field type. Used when defining rule requirements.
     */
    readonly fieldType: string;
  }

  const EnumField: EnumField;

  interface Fields {
    /**
     * Checks whether the value for a custom field is set to an expected value in the current transaction.
     * @param field The field to check.
     * @param expected The expected value.
     * @returns If the field is set to the expected value, returns `true`.
     */
    becomes(field: ProjectCustomField | string, expected: unknown): boolean;

    /**
     * Checks whether a user has permission to update the custom field.
     * @param field The custom field to check for read access.
     * @param user The user for whom the permission to read the custom field is checked.
     * @returns If the user can read the field, returns `true`.
     */
    canBeReadBy(field: ProjectCustomField | string, user: User): boolean;

    /**
     * Checks whether a user has permission to update the custom field.
     * @param field The custom field to check for update access.
     * @param user The user for whom the permission to update the custom field is checked.
     * @returns If the user can update the field, returns `true`.
     */
    canBeWrittenBy(field: ProjectCustomField | string, user: User): boolean;

    /**
     * Checks whether the custom field is changed in the current transaction.
     * @param field The name of the custom field (for example, 'State') or a reference to the field that is checked.
     */
    isChanged(field: ProjectCustomField | string): boolean;

    /**
     * Returns the previous value of a single-valued custom field before an update was applied.
     * If the field is not changed in the transaction, this value is equal to the current value of the field.
     * @param field The name of the custom field (for example, 'State') or a reference to the field for which
     * the previous value is returned.
     * @returns If the custom field is changed in the current transaction, the previous value of the field.
     * Otherwise, the current value of the field.
     */
    oldValue(field: ProjectCustomField | string): unknown;

    /**
     * Asserts that a value is set for a custom field. If a value for the required field is not set,
     * the specified message is displayed in the user interface.
     * @param fieldName The name of the custom field to check.
     * @param message The message that is displayed to the user that describes the field requirement.
     */
    required(fieldName: string, message: string): void;
  }

  /**
   * Represents the custom fields that are used in an issue.
   * The actual set of custom fields that are used for each issue is configured on a per-project basis.
   */
  // type Fields = Record<
  //   string,
  //   Field | MultiValueField<Field> | string | number | undefined
  // >;

  type DateField = number;
  type DateTimeField = number;

  /**
   * Represents an issue in YouTrack.
   */
  export class Issue<F extends Fields | unknown> extends BaseEntity {
    /**
     *
     * @param reporter Issue reporter.
     * @param project Project that the new issue is to belong to.
     * @param summary Issue summary.
     */
    constructor(reporter: User, project: Project, summary: string);

    /**
     *
     * @param ruleProperties Creates a declaration of a rule that a user can apply to one or more issues with a command or menu option.
     * The object that is returned by this method is normally exported to the `rule` property, otherwise it is not treated as a rule.
     */
    static action<F extends Fields, R extends Requirements>(
      ruleProperties: ActionRuleProperties<F, R>
    ): unknown;

    /**
     * Creates a declaration of a rule that is triggered when a change is applied to an issue.
     * The object that is returned by this method is normally exported to the `rule` property, otherwise it is not treated as a rule.
     *
     * @param ruleProperties A JSON object that defines the properties for the rule.
     * @returns The object representation of the rule.
     */
    static onChange<F extends Fields, R extends Requirements>(
      ruleProperties: OnChangeRuleProperties<F, R>
    ): unknown;

    /**
     * Creates a declaration of a rule that is triggered on a set schedule.
     * The object that is returned by this method is normally exported to the `rule` property, otherwise it is not treated as a rule.
     *
     * @param ruleProperties A JSON object that defines the properties for the rule.
     * @returns The object representation of the rule.
     */
    static onSchedule<F extends Fields, R extends Requirements>(
      ruleProperties: OnScheduleRuleProperties<F, R>
    ): unknown;

    /**
     * Creates a declaration of a state-machine rule. The state-machine imposes restrictions for the transitions between values in a custom field.
     * You can execute actions when the custom field is set to a value, changes from a value, or transitions from two specific values.
     * The object that is returned by this method is normally exported to the `rule` property, otherwise it is not treated as a rule.
     * @param ruleProperties A JSON object that defines the properties for the rule.
     */
    static stateMachine<R extends Requirements>(
      ruleProperties: StateMachineRuleProperties<R>
    ): unknown;

    /**
     * Finds an issue by its visible ID.
     * @param id The issue ID.
     * @returns The issue that is assigned the specified ID.
     */
    static findById<F>(id: string): Issue<F>;

    /**
     * The issue ID.
     */
    readonly id: string;

    readonly attachments: Set<IssueAttachment<F>>;

    /**
     * When `true`, the entity is removed in the current transaction. Otherwise, `false`.

     * @since 2017.4.37915
     */
    readonly becomesRemoved: boolean;

    /**
     * If the issue becomes reported in the current transaction, this property is `true`.
     */
    readonly becomesReported: boolean;

    /**
     * If the issue is assigned a state that is considered resolved in the current transaction, this property is `true`.
     */
    readonly becomesResolved: boolean;

    /**
     * If the issue is assigned a state that is considered unresolved in the current transaction. this property is `true`.
     */
    readonly becomesUnresolved: boolean;

    /**
     * A list of comments for the issue.
     */
    readonly comments: Set<IssueComment<F>>;

    /**
     * The date when the issue was created.
     */
    readonly created: number;

    /**
     * The text that is entered as the issue description.
     */
    description: string;

    /**
     * The root issue in a tree of duplicates that are linked to the issue.
     * For example, if `issueA` duplicates `issueB` and `issueB` duplicates `issueC`,
     * then the value for the `issueA.duplicateRoot` property is `issueC`.
     */
    readonly duplicateRoot: Issue<F>;

    /**
     * The set of comments that are edited in the current transaction. Comments that are added and removed are not considered to be edited.
     * Instead, these are represented by the `issue.comments.added` and `issue.comments.removed` properties.
     */
    readonly editedComments: IssueComment<F>;

    /**
     * The set of work items that are edited in the current transaction. Work items that are added and removed are not considered to be edited.
     * Instead, these are represented by the `issue.workItems.added` and `issue.workItems.removed` properties.
     *
     * @since 2017.4.37824
     */
    readonly editedWorkItems: IssueWorkItem;

    /**
     * The visible ID of an issue or similar object in an originating third-party system.
     *
     * @since 2018.2.42312
     */
    readonly externalId: string;

    /**
     * The URL for an issue or similar object in an originating third-party system.
     *
     * @since 2018.2.42312
     */
    readonly externalUrl: string;

    /**
     * The custom fields that are used in an issue. This is the collection of issue attributes like
     * `Assignee`, `State`, and `Priority` that are defined in the Custom Fields section of the administrative interface
     * and can be attached to each project independently.
     *
     * Issue attributes like `reporter`, `numberInProject`, and `project` are accessed directly.
     */
    readonly fields: F;

    /**
     * If the issue is already reported or becomes reported in the current transaction, this property is `true`.
     * To apply changes to an issue draft, use `!issue.isReported`.
     */
    readonly isReported: boolean;

    /**
     * If the issue is currently assigned a state that is considered resolved, this property is `true`.
     */
    readonly isResolved: boolean;

    /**
     * If the current user has added the star tag to watch the issue, this property is `true`.
     */
    readonly isStarred: boolean;

    /**
     * When `true`, the issue description is parsed as Markdown. When `false`, the issue description is parsed as YouTrack Wiki.
     * Changing this value does not transform the markup from one syntax to another.
     *
     * @since 2017.4.38870
     */
    readonly isUsingMarkdown: boolean;

    /**
     * Issue links (e.g. `relates to`, `parent for`, etc.). Each link is a {@link Set} of {@link Issue} objects.
     */
    links: Record<LinkTypeName, Set<Issue<unknown>>>;

    /**
     * The issue number in the project.
     */
    readonly numberInProject: number;

    /**
     * The user group for which the issue is visible. If the property contains a null value, the issue is visible to the All Users group.
     */
    permittedGroup: UserGroup | null;

    /**
     * The groups for which the issue is visible when the visibility is restricted to multiple groups.
     */
    permittedGroups: Set<UserGroup>;

    /**
     * The list of users for whom the issue is visible.
     */
    permittedUsers: Set<User>;

    /**
     * The project to which the issue is assigned.
     */
    project: Project;

    /**
     * The list of pull requests that are associated with the issue.
     *
     * @since 2020.3
     */
    readonly pullRequests: Set<unknown>; // TODO define PullRequest type

    /**
     * The user who reported (created) the issue.
     */
    reporter: User;

    /**
     * The date and time when the issue was assigned a state that is considered to be resolved.
     */
    readonly resolved: number;

    /**
     * The collection of sprints that this issue has been added to.
     */
    readonly sprints: Set<Sprint>;

    /**
     * The text that is entered as the issue summary.
     */
    summary: string;

    /**
     * The list of tags that are attached to an issue.
     */
    tags: Set<IssueTag>;

    /**
     * The date when the issue was last updated.
     */
    readonly updated: number;

    /**
     * The user who last updated the issue.
     */
    readonly updatedBy: User;

    /**
     * The absolute URL that points to the issue.
     */
    readonly url: string;

    /**
     * The list of commits that are associated with the issue.
     *
     * @since 2018.1.38923
     */
    readonly vcsChanges: Set<unknown>; // TODO define VcsChange type

    /**
     * Users who voted for the issue.
     *
     * @since 2020.5
     */
    readonly voters: Set<User>;

    /**
     * The number of votes for an issue. For vote-related methods, see User.canVoteIssue, User.voteIssue, User.canUnvoteIssue, and User.unvoteIssue.
     */
    readonly votes: number;

    /**
     * The set of work items that have been added to the issue.
     */
    readonly workItems: Set<IssueWorkItem>;

    /**
     * Attaches a file to the issue. Makes `issue.attachments.isChanged` return `true` for the current transaction.
     *
     * @param content
     * @param name The name of the file.
     * @param charset The charset of the file. Only applicable to text files.
     * @param mimeType The MIME type of the file.
     * @returns The attachment that is added to the issue.
     * @since 2019.2.53994
     */
    addAttachment(
      content: unknown,
      name: string,
      charset: string,
      mimeType: string
    ): IssueAttachment<F>;

    /**
     * Adds a comment to the issue. Makes `issue.comments.isChanged` return `true` for the current transaction.
     * @param text The text to add to the issue as a comment.
     * @param author The author of the comment.
     * @returns A newly created comment.
     */
    addComment(text: string, author: User): IssueComment<F>;

    /**
     * Adds a tag with the specified name to an issue. YouTrack adds the first matching tag that is visible to the current user.
     * If a match is not found, a new private tag is created for the current user.
     * When you use this method to add the star tag to an issue, the current user is added to the list of watchers.
     * To add a tag that is not visible to the current user, use the applyCommand method instead.
     * Use "add tag [tagName]" for the command parameter and specify the login for the owner of the tag in the runAs parameter.
     * @param name The name of the tag to add to the issue.
     * @returns The tag that has been added to the issue.
     */
    addTag(name: string): IssueTag;

    /**
     * Adds a work item to the issue.
     * @param description The description of the work item.
     * @param date The date that is assigned to the work item.
     * @param author The user who performed the work.
     * @param duration The work duration in minutes.
     * @param type The work item type.
     * @returns The new work item.
     */
    addWorkItem(
      description: string,
      date: number,
      author: User,
      duration: number,
      type: WorkItemType
    ): unknown; // TODO: define IssueWorkItem type

    /**
     *
     * @param command The command that is applied to the issue.
     * @param runAs Specifies the user by which the command is applied.
     * If this parameter is not set, the command is applied on behalf of the current user.
     */
    applyCommand(command: string, runAs: User): void;

    /**
     * Removes all of the attachments from the issue.
     */
    clearAttachments(): void;

    /**
     * Creates a copy of the issue.
     * @param project Project to create new issue in.
     * @returns The copy of the original issue.
     * @since 2018.1.40575.
     */
    copy(project: Project): Issue<F>;

    /**
     * Checks whether the specified tag is attached to an issue.
     * @param tagName The name of the tag to check for the issue.
     * @returns If the specified tag is attached to the issue, returns `true`.
     */
    hasTag(tagName: string): boolean;

    /**
     * Checks whether the issue is accessible by specified user.
     * @param user The user to check.
     * @returns If the issue is accessible for the user, returns 'true'.
     */
    isVisibleTo(user: User): boolean;

    /**
     * Removes a tag with the specified name from an issue. If the specified tag is not attached to the issue, an exception is thrown.
     * This method first searches through tags owned by the current user, then through all other visible tags.
     * To remove a tag that is not visible to the current user, use the applyCommand method instead.
     * Use "remove tag [tagName]" for the command parameter and specify the login for the owner of the tag in the runAs parameter.
     * @param name The name of the tag to remove from the issue.
     * @returns The tag that has been removed from the issue.
     */
    removeTag(name: string): IssueTag;

    /**
     * Converts text with Markdown or YouTrack Wiki markup to HTML. Use this method to send "pretty" notifications.
     * @param text The string of text to convert to HTML.
     * @param usingMarkdown if `true`, the markup is parsed as Markdown. If `false`, the markup is parsed as YouTrack Wiki.
     * If omitted, issue.isUsingMarkdown is used implicitly. Available since 2018.1.40100.
     */
    wikify(text: string, usingMarkdown: boolean): string;
  }

  export interface IssueAttachment<F extends Fields | unknown>
    extends PersistentFile {
    /**
     * The user who attached the file to the issue.
     */
    readonly author: User;

    /**
     * The content of the file in binary form.
     * @since 2019.2.53994
     */
    readonly content: unknown;

    /**
     * The date and time when the attachment was created as a timestamp.
     */
    readonly created: number;

    /**
     * The URL of the issue attachment.
     * @since 2019.2.56440
     */
    readonly fileUrl: string;

    /**
     * If the attachment is removed, this property is `true`.
     */
    readonly isRemoved: boolean;

    /**
     * The issue that the file is attached to.
     */
    readonly issue: Issue<F>;

    /**
     * The image dimensions. For image files, the value is rw=_width_&rh=_height_.
     * For non-image files, the value is `empty`.
     */
    readonly metaData: string;

    /**
     * The group for which the attachment is visible when the visibility is restricted to a single group.
     */
    permittedGroup: UserGroup;

    /**
     * The groups for which the issue is visible when the visibility is restricted to multiple groups.
     */
    permittedGroups: Set<UserGroup>;

    /**
     * The list of users for whom the attachment is visible.
     */
    permittedUsers: Set<User>;

    /**
     * The date and time the attachment was last updated as a timestamp.
     */
    readonly updated: number;

    /**
     * Permanently deletes the attachment.
     * @since 2018.1.40030
     */
    delete(): void;
  }

  export interface IssueComment<F extends Fields | unknown> extends BaseEntity {
    /**
     * The set of attachments that are attached to the comment.
     * @since 2018.1.40030
     */
    readonly attachments: Set<IssueAttachment<F>>;

    /**
     * The user who created the comment.
     */
    readonly user: User;

    /**
     * TODO documentation missing
     */
    readonly created: number;

    /**
     * `true` in case the comment is displayed as removed.
     * @since 2020.6.4500
     */
    readonly deleted: boolean;

    /**
     * 	When `true`, the comment text is parsed as Markdown. When `false`, the comment text is parsed as YouTrack Wiki.
     * Changing this value does not transform the markup from one syntax to another.
     * @since 2017.4.38870
     */
    readonly isUsingMarkdown: boolean;

    /**
     * The issue the comment belongs to.
     */
    readonly issue: Issue<F>;

    /**
     * A group who's members are allowed to access the comment.
     */
    permittedGroup: UserGroup;

    /**
     * Groups whos members are allowed to access the comment.
     */
    permittedGroups: Set<UserGroup>;

    /**
     * Users that are allowed to access the comment.
     */
    permittedUsers: Set<User>;

    /**
     * TODO documentation missing
     */
    text: string;

    /**
     * TODO documentation missing
     */
    readonly updated: number;

    /**
     * The user who last updated the comment.
     */
    readonly updatedBy: User;

    /**
     * The absolute URL (permalink) that points to the comment.
     */
    readonly url: string;

    /**
     * Attaches a file to the issue comment. Makes `issue.attachments.isChanged` return `true` for the current transaction.
     *
     * @param content The content of the file in binary form.
     * @param name The name of the file.
     * @param charset The charset of the file. Only applicable to text files.
     * @param mimeType The MIME type of the file.
     * @returns The attachment that is added to the issue comment.
     * @since 2020.6.3400
     */
    addAttachment(
      content: unknown,
      name: string,
      charset: string,
      mimeType: string
    ): IssueAttachment<F>;

    /**
     * Logically deletes the comment. This means that the comment is marked as deleted, but remains in the database.
     * Users with sufficient permissions can restore the comment or delete the comment permanently from the user interface.
     * The option to delete comments permanently has not been implemented in this API.
     * @since 2018.1.38923
     */
    delete(): void;
  }

  type IssueFolder = BaseEntity;

  /**
   * Represents an issue link type.
   */
  export interface IssueLinkPrototype extends BaseEntity {
    /**
     * The inward name of the issue link type.
     */
    readonly inward: string;

    /**
     * The outward name of the issue link type.
     */
    readonly outward: string;
  }

  const IssueLinkPrototype: IssueLinkPrototype;

  /**
   * Represents a tag.
   */
  export interface IssueTag extends WatchFolder {
    /**
     * The user who created the tag.
     */
    readonly owner: User;

    /**
     * The group of users for whom the tag or saved search is visible.
     * If the tag or the saved search is only visible to its owner, the value for this property is `null`.
     * Use `folder.permittedReadUserGroups` and `folder.permittedReadUsers` instead.
     */
    readonly shareGroup: UserGroup | null;

    /**
     * The group of users who are allowed to update the settings for the tag or saved search.
     * If the tag or the saved search can only be updated by its owner, the value for this property is `null`.
     * Use `folder.permittedUpdateUserGroups` and `folder.permittedUpdateUsers` instead.
     */
    readonly updateShareGroup: UserGroup | null;
  }

  const IssueTag: IssueTag;

  /**
   * Represents a work item that has been added to an issue.
   */
  export interface IssueWorkItem extends BaseWorkItem {
    /**
     * The duration of the work item in minutes.
     * Writable since 2018.1.40800
     */
    duration: number;

    /**
     *  Permanently deletes the work item.
     *  @since 2018.2.42312
     */
    delete(): void;
  }

  /**
   * An object that enables traversal through the elements in a collection.
   */
  export interface Iterator<T> {
    /**
     * @returns An object that contains values for the properties `done` and `value` properties.
     * If there are elements that were not traversed, `done` is `false` and `value` is the next element in the collection.
     * If all of the elements were traversed, `done` is `true` and `value` is `null`.
     */
    next(): IteratorResult<T>;
  }

  const Iterator: Iterator<unknown>;

  export interface IteratorResult<T> {
    /**
     * If there are elements that were not traversed, `done` is `false`.
     * If all of the elements were traversed, `done` is `true`.
     */
    readonly done: boolean;

    /**
     * If there are elements that were not traversed `value` is the next element in the collection.
     * If all of the elements were traversed `value` is `null`.
     */
    readonly value: T | null;
  }

  /**
   * Represents a value in a custom field that has a user associated with it, a so-called owner.
   */
  export interface OwnedField extends Field {
    /**
     * Field type. Used when defining rule requirements.
     */
    readonly fieldType: FieldType;

    /**
     * The user who is associated with the value.
     */
    readonly owner: User;
  }

  /**
   * Represents the common ancestor for all persistent files that are available in YouTrack.
   */
  export interface PersistentFile extends BaseEntity {
    /**
     * The charset type of the file. Only applicable to text files.
     * @since 2019.2.53994
     */
    readonly charset: string;

    /**
     * The extension that defines the file type.
     */
    readonly extension: string;

    /**
     * The MIME type of the file.
     * @since 2019.2.53994
     */
    readonly mimeType: string;

    /**
     * The name of the file.
     */
    readonly name: string;

    /**
     * The size of the attached file in bytes.
     */
    readonly size: number;
  }

  /**
   * Represents a YouTrack project.
   */
  export interface Project extends IssueFolder {
    /**
     * The description of the project as shown on the project profile page.
     */
    readonly description: string;

    /**
     * The set of custom fields that are available in the project.
     */
    readonly fields: Set<ProjectCustomField>;

    /**
     * If the project is currently archived, this property is `true`.
     */
    readonly isArchived: boolean;

    /**
     * A list of all issues that belong to the project.
     */
    readonly issues: Set<Issue<unknown>>;

    /**
     * The ID of the project. Use instead of project.shortName, which is deprecated.
     */
    readonly key: string;

    /**
     * The user who is set as the project lead.
     */
    readonly leader: User;

    /**
     * The name of the project.
     */
    readonly name: string;

    /**
     * The email address that is used to send notifications for the project.
     * If a 'From' address is not set for the project, the default 'From' address for the YouTrack server is returned.
     */
    readonly notificationEmail: string;

    /**
     * @deprecated
     * The ID of the project.
     */
    readonly shortName: string;

    /**
     * A UserGroup object that contains the users and members of groups who are assigned to the project team.
     * @since 2017.4.38235
     */
    readonly team: UserGroup;

    /**
     * Gets the number of minutes that occurred during working hours in a specified interval.
     * For example, if the interval is two days and the number of working hours in a day is set to 8, the result is
     * 2 * 8 * 60 = 960
     *
     * @param start Start of the interval.
     * @param end End of the interval.
     * @returns The number of minutes that occurred during working hours in the specified interval.
     */
    intervalToWorkingMinutes(start: number, end: number): number;
  }

  class ProjectConstructor {
    /**
     * Finds a project by ID.
     * @param key The ID of the project to search for.
     * @returns The project, or null when there are no projects with the specified ID.
     */
    findByKey(key: string): Project | null;

    /**
     * Finds a project by name.
     * @param name The name of the project to search for.
     * @returns The project, or null when there are no projects with the specified name.
     */
    findByName(name: string): Project | null;
  }

  const Project: ProjectConstructor;

  /**
   * Represents a custom field that is available in a project.
   */
  export interface ProjectCustomField extends BaseEntity {
    /**
     * The localized name of the field.
     */
    readonly localizedName: string;

    /**
     * The name of the field.
     */
    readonly name: string;

    /**
     * The text that is displayed for this field when it is empty.
     */
    readonly nullValueText: string;

    /**
     * Checks if the changes that are applied in the current transaction remove the condition to show the custom field.
     * @param issue The issue for which the condition for showing the field is checked.
     * @returns	When `true`, the condition for showing the field is removed in the current transaction.
     * @since 2018.2.42312
     */
    becomesInvisibleInIssue(issue: Issue<unknown>): boolean;

    /**
     * Checks if the changes that are applied in the current transaction satisfy the condition to show the custom field.
     * @param issue The issue for which the condition for showing the field is checked.
     * @returns	When `true`, the condition for showing the field is met in the current transaction.
     * @since 2018.2.42312
     */
    becomesVisibleInIssue(issue: Issue<unknown>): boolean;

    /**
     * Returns the background color that is used for this field value in the specified issue.
     * Can return `null`, `"white"`, or a hex color presentation.
     * @param issue The issue for which the background color is returned.
     * @returns The background color that is used for this field value in the specified issue.
     */
    getBackgroundColor(issue: Issue<unknown>): string | null;

    /**
     * Returns the foreground color that is used for this field value in the specified issue.
     * Can return `null`, `"white"`, or a hex color presentation.
     * @param issue The issue for which the foreground color is returned.
     * @returns The foreground color that is used for this field value in the specified issue.
     */
    getForegroundColor(issue: Issue<unknown>): string | null;

    /**
     * Returns the string presentation of the value that is stored in this field in the specified issue.
     * @param issue The issue for which the value presentation is returned.
     * @returns The string presentation of the value.
     */
    getValuePresentation(issue: Issue<unknown>): string;

    /**
     * Checks if a field is visible in the issue.
     * @param issue The issue for which the condition for showing the field is checked.
     * @returns When `true`, the condition for showing the custom field in the issue has been met.
     * It can also mean that the field is not shown on a conditional basis and is always visible.
     */
    isVisibleInIssue(issue: Issue<unknown>): boolean;
  }

  /**
   * Represents a value in a custom field that stores a version type.
   */
  export interface ProjectVersion extends Field {
    /**
     * If the version is released, this property is `true`.
     */
    readonly isReleased: boolean;

    /**
     * Field type. Used when defining rule requirements.
     */
    readonly fieldType: FieldType;

    /**
     * The release date that is associated with the version.
     */
    readonly releaseDate: number;
  }

  const ProjectVersion: ProjectVersion;

  /**
   * A single element in a set of {@link Requirements}
   */
  export interface Requirement {
    /**
     * An optional issue ID, used instead of name for {@link Issue} requirements.
     */
    id?: string;

    /**
     * The inward name of the issue link type (equals outward name if not set).
     */
    inward?: LinkTypeName;

    /**
     * An optional login, used instead of name for {@link User} requirements.
     */
    login?: string;

    /**
     * An optional flag, `false` by default.
     * If `true`, a required field must store multiple values (if applicable).
     */
    multi?: boolean;

    /**
     * The optional name of the field or entity. If not provided, the key (alias) for this requirement in the
     * {@link Requirements} object is used.
     */
    name?: string;

    /**
     * The outward name of the issue link type (required for IssueLinkPrototype requirements).
     */
    outward?: LinkTypeName;

    /**
     * The data type of the entity. Can be one of the following custom field types: [...] {@link Field}.periodType
     */
    type: FieldType;
  }

  type TypedRequirement<T> = Requirement & T & BundleProjectCustomField<T>;

  /**
   * The `Requirements` object serves two purposes.
   * First, it functions as a safety net. It specifies the set of entities that must exist for a rule to work as
   * expected. Whenever one or more rule requirements are not met, corresponding errors are shown in the workflow
   * administration UI. The rule is not executed until all of the problems are fixed.
   *
   * Second, it functions as a reference.
   * Each entity in the requirements is plugged into the `context` object, so you can reference entities from inside
   * your context-dependent functions (like an `action` function).
   *
   * There are two types of requirements: project-wide and system-wide.
   * Project-wide requirements contain a list of custom fields that must be attached
   * to each project that uses the rule as well as the required values from the sets of values for each custom field.
   * System-wide requirements contain a list of other entities that must be available in YouTrack.
   * This includes users, groups, projects, issues, tags, saved searches, and issue link types.
   */
  type Requirements = Record<string, TypedRequirement<unknown>>;

  export interface SavedQuery extends WatchFolder {
    /**
     * The user who created the saved search.
     */
    readonly owner: User;

    /**
     * The search query.
     */
    readonly query: string;
  }

  /**
   * The `Set` object stores unique values of any type, whether primitive values or
   * object references. The Set is used as storage for all multi-value objects in
   * this API: custom fields that store multiple values, issue links, issues in a project, and so on.
   * You can access single values in the collection directly (see first(), last(), get(index)),
   * use an iterator (see entries(), values()), or traverse with forEach(visitor)
   * and find(predicate) methods.
   *
   * The workflow API is based on ECMAScript 5.1.
   * This Set implementation mimics the functionality supported by the
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set|ES 6 Set interface}.
   */

  export interface Set<T> {
    /**
     * The elements that are added to a field that stores multiple values in the current transaction.
     * Only relevant when the Set represents a multi-valued property (field) of a persistent entity.
     */
    added: Set<T>;

    /**
     * When the Set represents a multi-valued property (field) of a persistent entity and the field is changed in the
     * current transaction, this property is `true`.
     */
    isChanged: boolean;

    /**
     * The elements that are removed from a field that stores multiple values in the current transaction.
     * Only relevant when the Set represents a multi-valued property (field) of a persistent entity.
     */
    removed: Set<T>;

    /**
     * The number of elements in a Set.
     * Use thoughtfully, as the calculation for large collections (like `project.issues`) may be resource consumptive.
     */
    readonly size: number;

    /**
     * Add an element to a Set. If the specified value is already present, a duplicate value is not added.
     * @param element The element to add to the Set.
     */
    add(element: T): void;

    /**
     * Remove all of the values from a Set.
     */
    clear(): void;

    /**
     * Remove an element from a Set. If the specified element is not present, nothing happens.
     * @param element The element to remove from the Set.
     */
    delete(element: T): void;

    /**
     * Get an iterator for the entries in a Set. The same as `values()`.
     * Use an iterator when you need to traverse over entries until a specific condition is met and modify the entries at the same time.
     * @returns An iterator for the collection of values.
     */
    entries(): Iterator<T>;

    /**
     * Find the first element in a Set for which a predicate function returns `true`.
     * @param predicate A function with one argument that returns either true or false for a given value in the Set.
     * @returns The first value that returns `true` for the predicate function or null.
     */
    find(predicate: (element: T) => boolean): T | null;

    /**
     * Find the first object in a collection based on the order in which the elements were added to the Set.
     * @returns The first object in a collection or null if the collection is empty.
     */
    first(): T | null;

    /**
     * Apply a visitor function to each member of a collection.
     * @param visitor The function to be applied to each member of the collection.
     */
    forEach(visitor: (element: T) => void): void;

    /**
     * Find an element with a specific index position in a Set.
     * @param index The ordinal index of the element to be returned from the Set.
     * @returns An object at index position in a Set, or null if the Set contains fewer than (index + 1) elements.
     */
    get(index: number): T | null;

    /**
     * Checks a Set object to determine whether the specified element is present in the collection or not.
     * @param element The element to locate in the Set.
     * @returns If the element is found, returns `true`, otherwise, `false`.
     */
    has(element: T): boolean;

    /**
     * Checks a Set object to determine whether it is empty.
     * @returns If the Set is empty, returns `true`, otherwise, `false`.
     */
    isEmpty(): boolean;

    /**
     * Checks a Set object to determine whether it is not empty.
     * @returns If the Set is not empty, returns `true`, otherwise, `false`.
     */
    isNotEmpty(): boolean;

    /**
     * Find the last object in a collection based on the order in which the elements were added to the Set.
     * @returns The last object in a collection or null if collection is empty.
     */
    last(): T | null;

    /**
     * Get an iterator for the entries in a Set. The same as `entries()`.
     * @returns An iterator for the collection of values.
     */
    values(): Iterator<T>;
  }

  /**
   * Base class for custom fields that store simple values like strings and numbers.
   */
  type SimpleProjectCustomField = ProjectCustomField;

  /**
   * Represents a sprint that is associated with an agile board. Each sprint can include issues from one or more projects.
   */
  export interface Sprint extends BaseEntity {
    /**
     * The agile board that the sprint belongs to.
     */
    readonly agile: Agile;

    /**
     * The end date of the sprint.
     */
    readonly finish: number;

    /**
     * If the sprint is currently archived, this property is `true`.
     */
    readonly isArchived: boolean;

    /**
     * The name of the sprint.
     */
    readonly name: string;

    /**
     * The start date of the sprint.
     */
    readonly start: number;

    /**
     * Checks whether the specified issue is represented as a swimlane on the agile board that the sprint belongs to.
     * @param issue The issue to check.
     * @returns If the specified issue is represented as a swimlane in the sprint, returns `true`.
     */
    isSwimlane(issue: Issue<unknown>): boolean;
  }

  /**
   * Represents a value in a custom field that stores a state type.
   */
  export interface State extends Field {
    /**
     * Field type. Used when defining rule requirements.
     */
    readonly fieldType: FieldType;

    /**
     * If issues in this state are considered to be resolved, ths property is `true`.
     */
    readonly isResolved: boolean;

    /**
     * The position of the value in the set of values for the custom field.
     */
    readonly ordinal: number;
  }

  const State: State;

  /**
   * Represents a custom field that stores a string of characters as text. When displayed in an issue, the text is shown as formatted in Markdown.
   */
  type TextProjectCustomField = SimpleProjectCustomField;

  /**
   * Represents a user account in YouTrack.
   */
  export interface User extends BaseEntity {
    /**
     * The current (logged in) user.
     */
    readonly current: User;

    /**
     * Field type. Used when defining rule requirements.
     */
    readonly fieldType: FieldType;

    /**
     * The absolute URL of the image that is used as the avatar for a user account.
     * May point to an external service, like Gravatar.
     * @since 2019.3
     */
    readonly avatarUrl: string;

    /**
     * The email address of the user.
     */
    readonly email: string;

    /**
     * First day of week as set in the user's profile settings. 0 is for Sunday, 1 is for Monday, etc.
     * @since 2019.1.50122
     */
    readonly firstDayOfWeeks: number;

    /**
     * The full name of the user as seen in their profile.
     */
    readonly fullName: string;

    /**
     * If the user is currently banned, this property is `true`.
     */
    readonly isBanned: boolean;

    /**
     * The login of the user.
     */
    readonly login: string;

    /**
     * ID of the user in Hub. You can use this ID for operations in Hub, and for matching users between YouTrack and Hub.
     * @since 2020.6.3000
     */
    readonly ringId: string;

    /**
     * User's time zone id.
     */
    readonly timeZoneId: string;

    /**
     * The full name of the user or the login if the full name is not set.
     */
    readonly visibleName: string;

    /**
     * Finds users by email.
     * @param email The email to search for.
     * @returns Users with the specified email.
     * @since 2018.2.41100
     */
    findByEmail(email: string): Set<User>;

    /**
     * Finds users by login.
     * @param email The login of the user account to search for.
     * @returns The specified user, or null when a user with the specified login is not found.
     */
    findByLogin(email: string): User | null;

    /**
     * Finds a user by email.
     * @param email The email of the user account to search for.
     * @returns The specified user, or null when a user with the specified email is not found or there are multiple users with the specified email.
     * @since 2018.2.41100
     */
    findUniqueByEmail(email: string): User | null;

    /**
     * Checks whether the user is able to remove their vote from the specified issue.
     * @param issue The issue to check.
     * @returns If the user can vote for the issue, returns `true`.
     */
    canUnvoteIssue(issue: Issue<unknown>): boolean;

    /**
     * Checks whether the user is able to vote for the specified issue.
     * @param issue The issue to check.
     * @returns If the user can vote for the issue, returns `true`.
     */
    canVoteIssue(issue: Issue<unknown>): boolean;

    /**
     * Returns a tag that is visible to the user.
     * @param name The name of the tag.
     * @param createIfNotExists If `true` and the specified tag does not exist
     * or is not visible to the user and the user has permission to create tags, a new tag with the specified name is created.
     * @returns The tag.
     */
    getTag(name: string, createIfNotExists: boolean): IssueTag;

    /**
     * Checks whether the user is granted the specified role in the specified project.
     * When the project parameter is not specified, checks whether the user has the specified role in any project.
     * @param roleName The name of the role to check for.
     * @param project The project to check for the specified role assignment.
     * If omitted, checks if the user has the global role.
     * @returns If the user is granted the specified role, returns `true`.
     */
    hasRole(roleName: string, project: Project): boolean;

    /**
     * Checks whether the user is a member of the specified group.
     * @param groupName The name of the group to check for.
     * @returns If the user is a member of the specified group, returns `true`.
     */
    isInGroup(groupName: string): boolean;

    /**
     * Sends an email notification to the email address that is set in the user profile.
     * @param subject The subject line of the email notification.
     * @param body The message text of the email notification.
     * @param ignoreNotifyOnOwnChangesSetting If `false`, the message is not sent when changes are performed on behalf of the current user.
     * Otherwise, the message is sent anyway.
     * @param project When set, the email address that is used as the 'From' address for the specified project is used to send the message.
     */
    notify(
      subject: string,
      body: string,
      ignoreNotifyOnOwnChangesSetting: boolean,
      project: Project
    ): void;

    /**
     * Sends a notification message over Jabber. Similar to the `notify` method,
     * the message won't be sent on own changes and corresponding flag unchecked.
     * @param message The message text for the Jabber notification.
     */
    sendJabber(message: string): void;

    /**
     * Sends an email notification to the email address that is set in the user profile. An alias for notify(subject, body, true).
     * @param subject The subject line of the email notification.
     * @param body The message text of the email notification.
     */
    sendMail(subject: string, body: string): void;

    /**
     * Removes a vote on behalf of the user from the issue, if allowed.
     * @param issue The issue from which the vote is removed.
     */
    unvoteIssue(issue: Issue<unknown>): void;

    /**
     * Removes the current user from the list of watchers for the issue (remove `Star` tag).
     * @param issue The issue to from which the user is removed as a watcher.
     */
    unwatchIssue(issue: Issue<unknown>): void;

    /**
     * Adds a vote on behalf of the user to the issue, if allowed.
     * @param issue The issue to which the vote is added.
     */
    voteIssue(issue: Issue<unknown>): void;

    /**
     * Adds the current user to the issue as a watcher (add `Star` tag).
     * @param issue The issue to which the user is added as a watcher.
     */
    watchIssue(issue: Issue<unknown>): void;
  }

  const User: User;

  /**
   * Represents a group of users.
   */
  export interface UserGroup extends BaseEntity {
    /**
     * The All Users group.
     */
    readonly allUsersGroup: UserGroup;

    /**
     * Field type. Used when defining rule requirements.
     */
    readonly fieldType: string;

    /**
     * The description of the group.
     */
    readonly description: string;

    /**
     * If the group is the All Users group, this property is `true`.
     */
    readonly isAllUsersGroup: boolean;

    /**
     * If the auto-join option is enabled for the group, this property is `true`.
     */
    readonly isAutoJoin: boolean;

    /**
     * The name of the group.
     */
    readonly name: string;

    /**
     * A list of users who are members of the group.
     */
    readonly users: Set<User>;

    /**
     * Finds a group by name.
     * @param name The name of the group to search for.
     * @returns The specified user group, or null when a group with the specified name is not found.
     */
    findByName(name: string): UserGroup;

    /**
     * Sends an email notification to all of the users who are members of the group.
     * @param subject The subject line of the email notification.
     * @param body The message text of the email notification.
     */
    notifyAllUsers(subject: string, body: string): void;
  }

  const UserGroup: UserGroup;

  export interface UserProjectCustomField extends ProjectCustomField {
    /**
     * The default value for the custom field.
     */
    readonly defaultUsers: Set<User>;

    /**
     * The list of available values for the custom field.
     */
    readonly values: Set<User>;

    /**
     * Returns the value that matches the specified login in a custom field that stores values as a user type.
     * @param login The user login to search for in the set of values for the custom field.
     * @returns The user with the specified login. This user can be set as the value for a field that stores a user type.
     */
    findValueByLogin(login: string): User;
  }

  /**
   * Represents a common ancestor of classes that represent tags and saved searches.
   */
  export interface WatchFolder extends IssueFolder {
    /**
     * The name of the tag or saved search.
     */
    readonly name: string;

    /**
     * The groups of users for whom the tag or saved search is visible.
     */
    readonly permittedReadUserGroups: Set<UserGroup>;

    /**
     * The users for whom the tag or saved search is visible.
     */
    readonly permittedReadUsers: Set<User>;

    /**
     * The groups of users who are allowed to update the settings for the tag or saved search.
     */
    readonly permittedUpdateUserGroups: Set<UserGroup>;

    /**
     * The users who are allowed to update the settings for the tag or saved search.
     */
    readonly permittedUpdateUsers: Set<User>;

    /**
     * The group of users for whom the tag or saved search is visible.
     * If the tag or the saved search is only visible to its owner, the value for this property is `null`.
     * Use `folder.permittedReadUserGroups` and `folder.permittedReadUsers` instead.
     */
    readonly shareGroup: UserGroup | null;

    /**
     * The group of users who are allowed to update the settings for the tag or saved search.
     * If the tag or the saved search can only be updated by its owner, the value for this property is `null`.
     * Use `folder.permittedUpdateUserGroups` and `folder.permittedUpdateUsers` instead.
     */
    readonly updateShareGroup: UserGroup | null;
  }

  /**
   * Represents a work type that can be assigned to a work item.
   */
  export interface WorkItemType extends BaseEntity {
    /**
     * The name of the work item type.
     */
    readonly name: string;

    /**
     * Returns the set of work item types that are available in a project.
     * @param project The project for which work item types are returned.
     * @returns The set of available work item types for the specified project.
     */
    findByProject(project: Project): Set<WorkItemType>;
  }

  type LinkTypeName =
    | "parent for"
    | "subtask of"
    | "duplicates"
    | "is duplicated by"
    | "depends on"
    | "is required for"
    | "relates to";
}
