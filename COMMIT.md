# Commit messages policy


You MUST format commit messages as follow:

[type] <component or #feature>(optional) - \<summary of changes>  
\<skip 1 line>  
\<modifications details> x n lines

**[type]**: between square brackets, it define commit type.  
Possible categories are:  

**[feature]**: adding a feature  
**[refactor]**: code refactoring   
**[fix]**: bug fixing  
**[doc]**: add / modify documentation  
**[lint]**: correct linting errors and warnings  
**[project]**: changed linked to build, modify dependencies, change version, etc.  
**[i18n]**: text content modifications  
**[style]**: style modifications  
**[npm]**: npm script modifications  
**[ui]**: add or extend ui component  
**[styleguide]**: modifications about styleguide  
**[clean]**: clean formatting, blank lines, unused imports or else  
**[mock]**: modification about mock server


**\<component name or #feature-number>**: (optional) indicate which component is concerned or feature / fix reference.  
ex. :  
+ Core -
+	ProjectComponent -
+	mappingService -
+ \#kod-77 - (Jira ticket)
+ \#5 - (github issue)


**\<summary of changes>**: start with lowercase, in english, specify briefly what was done. Issues (from github or others) can be refers to with #<issue number>, preceded by the words “fix” or “close” in order to automatically close related issues.

**<skip 1 line>**

**\<modifications details>**: if necessary, add details about what have been done. You can had as many lines as necessary. Each line begin with lowercase and don’t end with point. As in description summary, you can refers to issues.


Commit messages examples:  
\--  
[feat] Stack - add new stack component  
\--  
[fix] resolve problem with authentication, fix #20  
\--  
[clean] clean imports  
\--  
[feat] #kod-20 - add new user to existing project  
  
add new user form in members page   
add new ui dropdown component  
fix issue #73  
\--  
