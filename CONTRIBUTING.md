## Code Contribution Guidelines

Thank you for choosing ChatElite open source project as your next development interest. Join the fabulous community of ‘Contributors’ with this project and discuss your questions with the community members. You can have a discussion on technical aspects, integration and introduction of new features to ChatElite web app. 

The Code Contribution Guidelines will help you understand the process of how you can contribute to the code development/ modification/ customization of ChatElite. Besides, these guidelines also tell you the coding rules.

### Issues
Issues are used to track bugs, feature requests, and more. 

### Feature requests
Your enhancements and feature requests for ChatElite are most welcome. However, you must check the feasibility of the feature to be added. The feature request should befit the scope of the project. 

To request a feature:
1.	Open an issue.
2.	Highlight it as a feature.
3.	Provide the outline for it so that it can be discussed. 

### Bug Reports
If you find any bug, you can help us by reporting the bug to our GitHub Repository. You can also submit a Pull Request with a fix.

**Before you report a bug, please check:**
    *	If the bug is already reported to avoid duplication.
    *	If the bug has been fixed already.

A Bug Report should consist of:
*	A detailed description of the bug. You may add screenshots for reference.
*	Steps to reproduce the bug.
*	Environment in which the bug occurs. This may include information about the version, OS, etc. you are using.

### Pull requests
1.	Fork the **ChatEliteUI** repository.
2.	Make your changes in a new Git branch:
    ```git checkout -b my-fix-branch master```
3.	Create your patch, including appropriate test cases.
4.	Follow our **Coding Rules**.
5.	Run the test suite to ensure that the application works fine after adding your fix.
6.	Commit your changes using a concise commit message that follows our **Commit Message Guidelines**. 
    ```git commit –a```
7.	Push your branch to GitHub:
    ```git push origin my-fix-branch```
8.	In GitHub, send a pull request to the respective branch.
9.	If we suggest changes then:
i.	Make the required updates.
ii.	Re-run test suites to ensure tests are still passing.
iii.	Rebase your branch and push to your GitHub repository (this will update your Pull Request):
```
git rebase master -i
git push -f
```

**After your pull request is merged**

After your pull request is merged, you can safely delete your branch and pull the changes from the main (upstream) repository:
*	Delete the remote branch on GitHub
```git push origin --delete my-fix-branch```

*	Check out the master branch:
```git checkout master -f```

*	Delete the local branch:
```git branch -D my-fix-branch```

*	Update your master with the latest upstream version:
```git pull --ff upstream master```

 
### Coding Rules
To ensure consistency throughout the source code, follow these rules when you are working:
•	All features or bug fixes must be tested by one or more specs (unit-tests).
•	All API methods must be documented. The documentation must have description of the method.
•	The source code must be in accordance with TSlint rules.
•	The source code must be well formatted.

### Commit Message Guidelines
The commit message should have:
•	Issue number
•	Issue type (feature, enhancement or bug fix)
•	Description

The commit message must be concise.
