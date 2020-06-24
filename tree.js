var myval=0;
var dr=0.01;
var dg=0.02;
var tree_last=[ [0.0,0.0,0.0] ];
var tree_iter=[0];

var last_point=[0.0,0.0,0.0]
var orients=[[0.0,1.0,0.0]]
var count_branch=1
var iterator_branch = 0
var noiseamp=0.1;
var noiseamp0=0.0;

MAX_BRANCHES=30
MAX_BRANCH_SIZE=3000
// matrix of x,y,z tree vertices
var treemat = new JitterMatrix("tree",3, "float32", MAX_BRANCH_SIZE,MAX_BRANCHES)

if (jsarguments.length>1)
	myval = jsarguments[1];

function ampset(a)
{
	noiseamp=a;
}

function ampset0(a)
{
	noiseamp0=a;
}

function drset(r)
{
	dr=r;
}
	
function reset()
{
	treemat.setall(0)

	tree=[ [[0.0,0.0,0.0]] ]
	last_point=[0.0,0.0,0.0]
	orients=[[0.0,1.0*dr,0.0]]
	count_branch=1
	iterator_branch = 0
}

function bang()
{
	for (i = 0; i < count_branch ; i++) {
		
	l = tree_last[i]
	no=tree_iter[i]

	if (no>MAX_BRANCH_SIZE)
	{
		continue;
	}
	
	o = orients[i]

	xn0=(Math.random()-0.5)*noiseamp0;  
	yn0=(Math.random()-0.5)*noiseamp0;
	zn0=(Math.random()-0.5)*noiseamp0;
	
	xno=(Math.random()-0.5)*noiseamp;  
	yno=(Math.random()-0.5)*noiseamp;
	zno=(Math.random()-0.5)*noiseamp;
	
	
	new_point=[l[0]+o[0]*dr+xn0,l[1]+o[1]*(1.0-Math.sqrt(no)*dg)*dr+yn0,l[2]+o[2]*dr+zn0];
	tree_last[i]=new_point;
	tree_iter[i]++;
	
	treemat.setcell(no,i,"val",new_point[0]+xno,new_point[1]+yno,new_point[2]+zno);
	}
		//outlet(0,"bang");
}

function msg_int(v)
{
	post("received int " + v + "\n");
	myval = v;
	bang();
}

function new_branch(v)
{	
	bn= Math.floor(Math.random() * Math.sqrt(count_branch));
	split_point = tree_last[bn];
 	
	myvalx=(Math.random()-0.5)/2.0;  
	myvaly=Math.random()/2.0;
	myvalz=(Math.random()-0.5)/2.0;
	
	orients.push([myvalx,myvaly,myvalz]);
	tree_last.push(split_point);
	tree_iter.push(0);
	
	treemat.setcell(0,count_branch,"val",split_point[0],split_point[1],split_point[2]);
	count_branch++;
}

function msg_float(v)
{
	post("received float " + v + "\n");
	myval = v;
	bang();
}

function list()
{
	var a = arrayfromargs(arguments);
	post("received list " + a + "\n");
	myval = a;
	bang();
}

function anything()
{
	var a = arrayfromargs(messagename, arguments);
	post("received message " + a + "\n");
	myval = a;
	bang();
}