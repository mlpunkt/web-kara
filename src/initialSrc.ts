export let initialSrc = 
`# BEFEHLE:
# kara.move()  kara.turnRight()  kara.turnLeft()
# kara.putLeaf()  kara.removeLeaf()
#
# SENSOREN:
# kara.treeFront()  kara.treeRight() kara.treeLeft()
# kara.onLeaf()  kara.mushroomFront()

kara.move()
kara.putLeaf()`


// export let initialSrc = 
// `# BEFEHLE:
// # kara.move()  kara.turnRight()  kara.turnLeft()
// # kara.putLeaf()  kara.removeLeaf()
// #
// # SENSOREN:
// # kara.treeFront()  kara.treeRight() kara.treeLeft()
// # kara.onLeaf  kara.mushroomFront()

// while True:
//     while not kara.treeFront():
//         kara.move()
//     kara.turnRight()
//     kara.move()
//     kara.turnLeft()
//     kara.move()
//     kara.move()
//     kara.turnLeft()
//     kara.move()
//     kara.turnRight()`



// 	let src=`kara.move()
// kara.turnLeft()
// kara.move()
// kara.turnRight()
// kara.move()`

// let src = `
// while True:
//     while not kara.treeFront():
//         kara.move()
//     kara.turnRight()
//     kara.move()
//     kara.turnLeft()
//     kara.move()
//     kara.move()
//     kara.turnLeft()
//     kara.move()
//     kara.turnRight()
// `

// let src=`
// while kara.treeRight():
//     kara.move()
// while kara.treeLeft():
//     kara.move()`


let src=`
while True:
    if kara.onLeaf():
        kara.removeLeaf()
    else:
        kara.putLeaf()
    kara.move()`

// 	let src=`import time
// move()
// time.sleep(1)
// move()
//`