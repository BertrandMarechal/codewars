'use strict';
process.env.local = true;
var expect = require('chai').expect;
var assert = require('chai').assert;
const RSUProgram = require('../challenges/roboscript-number-5-the-final-obstacle-implement-rsu.js');

describe('The tokenizer', () => {
    it(`should correctly tokenize valid RSU programs`, () => {
        expect(new RSUProgram('p0FFLFFR((FFFR)2(FFFFFL)3)4qp1FRqp2FP1qp3FP2qp4FP3qP0P1P2P3P4').getTokens())
            .to.deep.equal(['p0', 'F', 'F', 'L', 'F', 'F', 'R', '(', '(', 'F', 'F', 'F', 'R', ')2', '(', 'F', 'F', 'F', 'F', 'F', 'L', ')3', ')4', 'q', 'p1', 'F', 'R', 'q', 'p2', 'F', 'P1', 'q', 'p3', 'F', 'P2', 'q', 'p4', 'F', 'P3', 'q', 'P0', 'P1', 'P2', 'P3', 'P4']);
        expect(new RSUProgram(`p0
            (
              F2 L
            )2 (
              F2 R
            )2
          q

          (
            P0
          )2`).getTokens())
            .to.deep.equal(['p0', '(', 'F2', 'L', ')2', '(', 'F2', 'R', ')2', 'q', '(', 'P0', ')2']);
        expect(new RSUProgram(`/*
                    RoboScript Ultimatum (RSU)
                    A simple and comprehensive code example
                  */
    
                  // Define a new pattern with identifier n = 0
                  p0
                    // The commands below causes the MyRobot to move
                    // in a short snake-like path upwards if executed
                    (
                      F2 L // Go forwards two steps and then turn left
                    )2 (
                      F2 R // Go forwards two steps and then turn right
                    )2
                  q
    
                  // Execute the snake-like pattern twice to generate
                  // a longer snake-like pattern
                  (
                    P0
                  )2`).getTokens())
            .to.deep.equal(['p0', '(', 'F2', 'L', ')2', '(', 'F2', 'R', ')2', 'q', '(', 'P0', ')2']);
        expect(new RSUProgram(`// The global scope can "see" P1 and P2
                  p1
                    // P1 can see P2, P3 and P4
                    p3
                      // P3 can see P1, P2 and P4 though invoking
                      // P1 will likely result in infinite recursion
                      F L
                    q
                    p4
                      // Similar rules apply to P4 as they do in P3
                      F P3
                    q
    
                    F P4
                  q
                  p2
                    // P2 can "see" P1 and therefore can invoke P1 if it wishes
                    F3 R
                  q
    
                  (
                    P1 P2
                  )2 // Execute both globally defined patterns twice`).getTokens())
            .to.deep.equal(['p1', 'p3', 'F', 'L', 'q', 'p4', 'F', 'P3', 'q', 'F', 'P4', 'q', 'p2', 'F3', 'R', 'q', '(', 'P1', 'P2', ')2']);
        expect(new RSUProgram(`// The global scope can "see" P1 and P2
                      p1
                        // P1 can see P2, P3 and P4
                        p3
                          // P3 can see P1, P2 and P4 though invoking
                          // P1 will likely result in infinite recursion
                          F L
                        q
                        p4
                          // Similar rules apply to P4 as they do in P3
                          F P3
                        q
        
                        F P4
                      q
                      p2
                        // P2 can "see" P1 and therefore can invoke P1 if it wishes
                        F3 R
                      q
        
                      (
                        P1 P2
                      )2 // Execute both globally defined patterns twice`).getTokens())
            .to.deep.equal(['p1', 'p3', 'F', 'L', 'q', 'p4', 'F', 'P3', 'q', 'F', 'P4', 'q', 'p2', 'F3', 'R', 'q', '(', 'P1', 'P2', ')2']);
        expect(new RSUProgram(`p1
                p1
                  F R
                q

                F2 P1 // Refers to "inner" (locally defined) P1 so no infinite recursion results
              q

              (
                F2 P1 // Refers to "outer" (global) P1 since the
                // global scope can't "see" local P1
              )4

              /*
                Equivalent to executing the following raw commands:
                F F F F F R F F F F F R F F F F F R F F F F F R
              */`).getTokens()).to.deep.equal(['p1', 'p1', 'F', 'R', 'q', 'F2', 'P1', 'q', '(', 'F2', 'P1', ')4']);
    });
    it(`should throw an error if one or more invalid tokens are detected`, () => {
        // 'Your tokenizer should throw an error whenever there is whitespace before numbers (stray numbers)'
        const program = new RSUProgram(`p 0
            (
            F 2L
            ) 2 (
            F 2 R
            )         2
        q

        (
            P  0
        )2`);
        assert.throw(program.getTokens.bind(program), 'There is a whitespace before numbers');
    });
    it(`should throw an error if one or more invalid tokens are detected`, () => {
        // 'Your tokenizer should throw an error whenever there is whitespace before numbers (stray numbers)'
        const program = new RSUProgram(`this is a stray comment not escaped by a double slash or slash followed by asterisk F F F L F F F R F F F L F F F R and lowercase "flr" are not acceptable as commands`);
        assert.throw(program.getTokens.bind(program));
    });
    it(`should throw an error in the presence of "stray numbers`, () => {
        // 'Your tokenizer should throw an error whenever there is whitespace before numbers (stray numbers)'
        const program = new RSUProgram(`F 32R 298984`);
        assert.throw(program.getTokens.bind(program));
    });
})
describe('The compiler', () => {
    it(`should correctly convert valid RSU token sequences into raw command sequences`, () => {
        const program = new RSUProgram('p0FFLFFR((FFFR)2(FFFFFL)3)4qp1FRqp2FP1qp3FP2qp4FP3qP0P1P2P3P4');
        expect(program.convertToRaw(program.getTokens())).to.deep.equal([
            'F', 'F', 'L', 'F', 'F', 'R',
            'F', 'F', 'F', 'R', 'F', 'F', 'F', 'R',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'R', 'F', 'F', 'F', 'R',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'R', 'F', 'F', 'F', 'R',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'R', 'F', 'F', 'F', 'R',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'R',
            'F', 'F', 'R',
            'F', 'F', 'F', 'R',
            'F', 'F', 'F', 'F', 'R'
        ]);
    });
    it(`should correctly convert valid RSU token sequences into raw command sequences`, () => {
        const program = new RSUProgram('P0P1P2P3P4p0FFLFFR((FFFR)2(FFFFFL)3)4qp1FRqp2FP1qp3FP2qp4FP3q');
        expect(program.convertToRaw(program.getTokens())).to.deep.equal([
            'F', 'F', 'L', 'F', 'F', 'R',
            'F', 'F', 'F', 'R', 'F', 'F', 'F', 'R',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'R', 'F', 'F', 'F', 'R',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'R', 'F', 'F', 'F', 'R',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'R', 'F', 'F', 'F', 'R',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'F', 'F', 'F', 'F', 'L',
            'F', 'R',
            'F', 'F', 'R',
            'F', 'F', 'F', 'R',
            'F', 'F', 'F', 'F', 'R'
        ]);
    });
    it(`should correctly convert valid RSU token sequences into raw command sequences`, () => {
        const program = new RSUProgram(`p0
            (
              F2 L
            )2 (
              F2 R
            )2
          q

          (
            P0
          )2`);
        expect(program.convertToRaw(program.getTokens())).to.deep.equal([
            'F', 'F', 'L', 'F', 'F', 'L', 'F', 'F', 'R', 'F', 'F', 'R', 'F', 'F', 'L', 'F', 'F', 'L', 'F', 'F', 'R', 'F', 'F', 'R'
        ]);
    });
    it(`should correctly convert valid RSU token sequences into raw command sequences`, () => {
        const program = new RSUProgram(`// The global scope can "see" P1 and P2
          p1
            // P1 can see P2, P3 and P4
            p3
              // P3 can see P1, P2 and P4 though invoking
              // P1 will likely result in infinite recursion
              F L
            q
            p4
              // Similar rules apply to P4 as they do in P3
              F P3
            q

            F P4
          q
          p2
            // P2 can "see" P1 and therefore can invoke P1 if it wishes
            F3 R
          q

          (
            P1 P2
          )2 // Execute both globally defined patterns twice`);
        expect(program.convertToRaw(program.getTokens())).to.deep.equal([
            'F', 'F', 'F', 'L', 'F', 'F', 'F', 'R', 'F', 'F', 'F', 'L', 'F', 'F', 'F', 'R'
        ]);
    });
    it(`should correctly convert valid RSU token sequences into raw command sequences`, () => {
        const program = new RSUProgram(`p1
            p1
              F R
            q

            F2 P1 // Refers to "inner" (locally defined) P1 so no infinite recursion results
          q

          (
            F2 P1 // Refers to "outer" (global) P1 since the
            // global scope can't "see" local P1
          )4

          /*
            Equivalent to executing the following raw commands:
            F F F F F R F F F F F R F F F F F R F F F F F R
          */`);
        expect(program.convertToRaw(program.getTokens())).to.deep.equal([
            'F', 'F', 'F', 'F', 'F', 'R', 'F', 'F', 'F', 'F', 'F', 'R', 'F', 'F', 'F', 'F', 'F', 'R', 'F', 'F', 'F', 'F', 'F', 'R'
        ]);
    });
    it(`should work for the example provided in the Description`, () => {
        const program = new RSUProgram(`/*
            RoboScript Ultimatum (RSU)
            A simple and comprehensive code example
          */

          // Define a new pattern with identifier n = 0
          p0
            // The commands below causes the MyRobot to move
            // in a short snake-like path upwards if executed
            (
              F2 L // Go forwards two steps and then turn left
            )2 (
              F2 R // Go forwards two steps and then turn right
            )2
          q

          // Execute the snake-like pattern twice to generate
          // a longer snake-like pattern
          (
            P0
          )2`);
        expect(program.executeRaw(program.convertToRaw(program.getTokens()))).to.equal(
            "*  \r\n*  \r\n***\r\n  *\r\n***\r\n*  \r\n***\r\n  *\r\n***"
        );
    });
    it(`should work for the example provided in the Description`, () => {
        const program = new RSUProgram(`/*
            RoboScript Ultimatum (RSU)
            A simple and comprehensive code example
          */

          // Define a new pattern with identifier n = 0
          p0
            // The commands below causes the MyRobot to move
            // in a short snake-like path upwards if executed
            (
              F2 L // Go forwards two steps and then turn left
            )2 (
              F2 R // Go forwards two steps and then turn right
            )2
          q

          // Execute the snake-like pattern twice to generate
          // a longer snake-like pattern
          (
            P0
          )2`);
        expect(program.execute()).to.equal(
            "*  \r\n*  \r\n***\r\n  *\r\n***\r\n*  \r\n***\r\n  *\r\n***"
        );
    });
});
