using Candor.Configuration.Provider;
using Candor.Security;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Candor;

namespace StarterFly.Account
{
    public class MockUserProvider : UserProvider
    {
        private List<User> _users = null;
        private List<UserSalt> _salts = null;
        private List<AuthenticationHistory> _history = null;
        private List<UserSession> _sessions = null;

        public string UserJsonDataPath { get; set; }
        public string UserSaltJsonDataPath { get; set; }
        public string AuthenticationHistoryJsonDataPath { get; set; }
        public string UserSessionJsonDataPath { get; set; }

        public MockUserProvider()
        {
            Initialize("mock", new NameValueCollection());
        }
        public MockUserProvider(string name)
        {
            Initialize(name, new NameValueCollection());
        }
        public override void Initialize(string name, NameValueCollection config)
        {   //for XML configuration option
            base.Initialize(name, config);
            UserJsonDataPath = config.GetStringValue("userJsonDataPath", null);
            UserSaltJsonDataPath = config.GetStringValue("userSaltJsonDataPath", null);
            AuthenticationHistoryJsonDataPath = config.GetStringValue("authenticationHistoryJsonDataPath", null);
            UserSessionJsonDataPath = config.GetStringValue("userSessionJsonDataPath", null);
        }
        private void LoadSampleData()
        {
            var json = File.ReadAllText(UserJsonDataPath);
            _users = JsonConvert.DeserializeObject<List<User>>(json);

            json = File.ReadAllText(UserSaltJsonDataPath);
            _salts = JsonConvert.DeserializeObject<List<UserSalt>>(json);

            json = File.ReadAllText(AuthenticationHistoryJsonDataPath);
            _history = JsonConvert.DeserializeObject<List<AuthenticationHistory>>(json);

            json = File.ReadAllText(UserSessionJsonDataPath);
            _sessions = JsonConvert.DeserializeObject<List<UserSession>>(json);
        }

        public override User GetUserByID(Guid userId)
        {
            if (_users == null)
                LoadSampleData();

            return _users.FirstOrDefault(x => x.UserID.Equals(userId));
        }

        public override User GetUserByName(string name)
        {
            if (_users == null)
                LoadSampleData();

            return _users.FirstOrDefault(x => x.Name.Equals(name, StringComparison.InvariantCultureIgnoreCase));
        }

        protected override void InsertUserHistory(AuthenticationHistory history)
        {
            if (_history == null)
                LoadSampleData();

            _history.Add(history);
        }

        protected override void SaveUserSession(UserSession session)
        {
            if (_sessions == null)
                LoadSampleData();

            _sessions.RemoveAll(x => x.SessionID == session.SessionID); //replace existing
            _sessions.Add(session);
        }

        protected override void SaveUser(User user)
        {
            if (_users == null)
                LoadSampleData();

            _users.RemoveAll(x => x.UserID == user.UserID); //replace existing
            _users.Add(user);
        }

        protected override void SaveUserSalt(UserSalt salt)
        {
            if (_salts == null)
                LoadSampleData();

            _salts.RemoveAll(x => x.UserID == salt.UserID); //replace existing
            _salts.Add(salt);
        }

        protected override UserSalt GetUserSalt(Guid userId)
        {
            if (_salts == null)
                LoadSampleData();

            return _salts.FirstOrDefault(x => x.UserID.Equals(userId));
        }

        public override List<UserSession> GetLatestUserSessions(Guid userId, int take)
        {
            if (_sessions == null)
                LoadSampleData();

            return _sessions.Where(x => x.UserID.Equals(userId))
                .OrderByDescending(x => x.CreatedDate)
                .Take(take)
                .ToList();
        }

        protected override UserSession GetUserSession(Guid renewalToken)
        {
            if (_sessions == null)
                LoadSampleData();

            return _sessions.FirstOrDefault(x => x.RenewalToken.Equals(renewalToken));
        }

        protected override int GetRecentFailedUserNameAuthenticationCount(string name)
        {
            if (_history == null)
                LoadSampleData();

            return _history.Count(x => x.UserName.Equals(name, StringComparison.InvariantCultureIgnoreCase)
                && x.CreatedDate > DateTime.UtcNow.AddMinutes(-FailurePeriodMinutes));
        }

        protected override AuthenticationHistory GetSessionAuthenticationHistory(UserSession session)
        {
            if (_history == null)
                LoadSampleData();

            var latest = _history.Where(x => x.SessionID == session.SessionID && x.IsAuthenticated)
                .OrderByDescending(x => x.CreatedDate)
                .Take(1).ToList();
            return latest.Count > 0 ? latest[0] : null;
        }
    }
}
