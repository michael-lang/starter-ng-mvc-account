// must have one of the following: userName, emailAddress or phoneNumber
export class AccountSummary {
    id: string; //system assigned unique identifier (unchangeable), ex: A00A00
    firstName: string; //required
    lastName: string; //required
    dob: Date; //required, for age restriction enforcement
    userName: string; //ie. mlang93, optional (fallback to FirstName and last initial when displayed)
    emailAddress: string; //optional for notifications or login
    phoneNumber: string; //optional for notifications or login
    authSessionToken: string; //session specific auth token, must be supplied to other api calls.
    role: string; //'member', 'admin' - defines features of the app user can access (not for record based access)
}

export class AuthResponse {
    account: AccountSummary;
    status: string;
    message: string;
}

export class LoginModel {
    identifier: string; //username, emailAddress or phonenumber
    password: string;
    returnUrl: string; //route to redirect to on successful login
}
export class AuthTokenModel {
    authSessionToken: string;
}

//Requires at least one of the following: userName, emailAddress or phoneNumber
export class RegisterModel {
    userName: string;
    emailAddress: string; //optional for notifications, required if claiming an invite
    phoneNumber: string; //optional for notifications
    firstName: string;
    lastName: string;
    dob: Date; //required, for age restriction enforcement
    password: string;
    returnUrl: string; //route to redirect to on successful register
}
