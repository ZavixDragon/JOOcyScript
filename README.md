# JOOSyScript
Object Oriented Java Script is a simpler and cleaner way to code JS

All Traits have 1 of 2 implicitly inherited classes (It will tell you directly under it's declaration the inheritance)

Constant Trait: 
Means you can build one of this objects and attach it to as many of your entities as you want. 
So if you have a common styling no need to make one for every entity

Unique Trait:
You can only have this object attached to one entity at a time.
The reason for this is because it commonly holds something which can change. 
This means it has a degree of mutability which means it would not be sane to allow you to attach him to multiple entities. 
As such when you attempt to attach him to a second entity he will remove himself from the first entity. (This also prevent infinite loops)
